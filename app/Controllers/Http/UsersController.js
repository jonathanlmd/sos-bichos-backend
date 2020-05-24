const User = use('App/Models/User');

class UsersController {
  async create({ request, response }) {
    const userData = request.only(['name', 'email', 'password']);

    const hasUser = User.findBy('email', userData.email);

    if (hasUser) {
      return response.status(400).json({
        status: 'error',
        message: 'This e-mail already exist',
      });
    }

    const user = await User.create(userData);

    return response.json(user);
  }
}

module.exports = UsersController;
