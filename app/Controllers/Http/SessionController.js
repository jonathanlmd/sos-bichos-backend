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

    const savedAddress = user.toJSON().address;

    const token = await auth.withRefreshToken().attempt(email, password);

    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        profession: user.profession,
        birthdate: user.birthdate,
        created_at: user.created_at,
        updated_at: user.updated_at,
        cellphone: user.phone,
        address: savedAddress
          ? {
              cep: savedAddress.public_place.split('-').join(''),
              logradouro: savedAddress.street,
              localidade: savedAddress.city,
              uf: savedAddress.uf,
              bairro: savedAddress.district,
              complemento: savedAddress.complement,
              numero: savedAddress.number,
            }
          : null,
      },
      token,
    };
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

      await user.load('address');

      const savedAddress = user.toJSON().address;

      const token = await auth.withRefreshToken().generate(user);

      return response.json({
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          profession: user.profession,
          birthdate: user.birthdate,
          created_at: user.created_at,
          updated_at: user.updated_at,
          cellphone: user.phone,
          address: savedAddress
            ? {
                cep: savedAddress.public_place.split('-').join(''),
                logradouro: savedAddress.street,
                localidade: savedAddress.city,
                uf: savedAddress.uf,
                bairro: savedAddress.district,
                complemento: savedAddress.complement,
                numero: savedAddress.number,
              }
            : null,
        },
        token,
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Unable to authenticate. Try again later',
      });
    }
  }
}

module.exports = SessionController;
