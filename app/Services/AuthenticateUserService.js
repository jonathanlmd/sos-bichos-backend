import User from '../Models/User';

class AuthenticateUserService {
  async execute({ email, password }) {
    const user = await User.findBy('email', email);

    if (!user) {
      throw new Error('Incorrect email/password combination.', 401);
    }

    const token = await auth.attempt(email, password);

    if (!token) {
      throw new Error('Incorrect email/password combination.', 401);
    }

    return { user, token };
  }
}

export default AuthenticateUserService;
