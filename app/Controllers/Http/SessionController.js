/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @typedef {import('@adonisjs/ally/src/Ally')} Ally */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class SessionController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const { email, password } = request.all();
    const { authorization: refreshToken } = request.headers();

    if (refreshToken) {
      const token = await auth.generateForRefreshToken(
        refreshToken.split(' ')[1]
      );
      return { token };
    }

    if (!(email && password)) {
      return response.status(401).json({
        status: 'error',
        message: 'Email and password are requerid',
      });
    }

    const user = await User.findBy('email', email);

    if (!user) {
      return response.status(401).json({
        status: 'error',
        message: "Email or password don't match",
      });
    }
    await user.load('address');

    const token = await auth.withRefreshToken().attempt(email, password);

    return { user, token };
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Ally} ctx.ally
   */
  async social({ ally, request, response, auth }) {
    try {
      const { accessToken, provider } = request.all();
      const { authorization: refreshToken } = request.headers();

      if (refreshToken) {
        const token = await auth.generateForRefreshToken(
          refreshToken.split(' ')[1]
        );
        return { token };
      }

      const providerUser = await ally
        .driver(provider)
        .getUserByToken(accessToken);

      const userDetails = {
        email: providerUser.getEmail(),
        name: providerUser.getName(),
        avatar: providerUser.getAvatar(),
      };

      const user = await User.findOrCreate(
        { email: userDetails.email },
        userDetails
      );

      const token = await auth.withRefreshToken().generate(user);

      return response.json({ user, token });
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'Unable to authenticate. Try again later',
      };
    }
  }
}

module.exports = SessionController;
