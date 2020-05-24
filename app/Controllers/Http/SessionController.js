const User = use('App/Models/User');

class SessionController {
  async authenticate({ request, auth }) {
    const { email, password } = request.all();

    const user = await User.findBy('email', email);

    if (!user) {
      throw new Error("Email or password don't match");
    }

    const token = await auth.attempt(email, password);

    if (!token) {
      throw new Error("Email or password don't match");
    }

    return { user, token };
  }
}

module.exports = SessionController;
