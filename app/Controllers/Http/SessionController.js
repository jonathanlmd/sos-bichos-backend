/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

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

    const user = await User.findBy('email', email);

    if (!user) {
      return response.status(401).json({
        status: 'error',
        message: "Email or password don't match",
      });
    }
    await user.load('address');

    const { token } = await auth.attempt(email, password);

    return { user, token };
  }
}

module.exports = SessionController;
