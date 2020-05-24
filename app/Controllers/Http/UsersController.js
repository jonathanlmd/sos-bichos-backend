/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class UsersController {
  async create({ request, response, auth }) {
    const userData = request.only(['name', 'email', 'password']);

    const hasUser = await User.findBy('email', userData.email);

    if (hasUser) {
      return response.status(409).json({
        status: 'error',
        message: 'This e-mail already exist',
      });
    }

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
