/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Admin = use('App/Models/Admin');

class SessionAdmController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const { email, password } = request.all();

    const user = await Admin.findBy('email', email);

    if (!user) {
      return response.status(401).json({
        status: 'error',
        message: "Email or password don't match",
      });
    }

    const { token } = await auth
      .authenticator('adminjwt')
      .attempt(email, password);

    return { user, token };
  }
}

module.exports = SessionAdmController;
