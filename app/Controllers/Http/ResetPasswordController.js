/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ResetPasswordController {
  async update({ request, response }) {
    const { token, password } = request.only(['token', 'password']);

    const findedToken = await Token.findBy('token', token);

    if (!findedToken) {
      return response.status(409).json({
        status: 'error',
        message: 'Invalid token',
      });
    }

    const user = await User.query().where('id', findedToken.id_user).first();

    Object.assign(user, { password });

    await user.save();

    return response.json({ message: 'Your password was updated' });
  }
}

module.exports = ResetPasswordController;
