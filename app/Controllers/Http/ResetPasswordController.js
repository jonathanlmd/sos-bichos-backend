/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

const { differenceInHours } = require('date-fns');

class ResetPasswordController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response }) {
    const { token, password } = request.only(['token', 'password']);

    const userToken = await Token.findBy('token', token);
    if (!userToken) {
      return response.status(409).json({
        status: 'error',
        message: 'Invalid token',
      });
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInHours(new Date(), tokenCreatedAt) > 2) {
      return response.status(400).json({
        status: 'error',
        message: 'Token expired',
      });
    }

    const user = await userToken.user().fetch();

    Object.assign(user, { password });

    await user.save();

    return response.json({ message: 'Your password was updated' });
  }
}

module.exports = ResetPasswordController;
