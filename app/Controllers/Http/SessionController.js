/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class SessionController {
  async authenticate({ request, response, auth }) {
    const { email, password } = request.all();

    const user = await User.findBy('email', email);

    if (!user) {
      return response.status(401).json({
        status: 'error',
        message: "Email or password don't match",
      });
    }

    const { token } = await auth.attempt(email, password);

    return { user, token };
  }
}

module.exports = SessionController;
