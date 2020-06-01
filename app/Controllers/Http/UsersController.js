/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class UsersController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const userData = request.only(['name', 'email', 'password']);

    const user = await User.create(userData);

    if (!user) {
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }

    const { token } = await auth.attempt(userData.email, userData.password);

    return response.json({ user, token });
  }
}

module.exports = UsersController;
