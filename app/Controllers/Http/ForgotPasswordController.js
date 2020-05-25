/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

const Mail = use('Mail');

class ForgotPasswordController {
  async store({ request, response }) {
    const { email } = request.only(['email']);

    const user = await User.findBy('email', email);

    if (!user) {
      return response
        .status(409)
        .json({ status: 'error', message: 'E-mail not registred' });
    }

    const token = await Hash.make(user.id);

    await user.tokens().create({ token, type: 'forgotpassword' });

    await Mail.send(
      'forgotpassword',
      {
        name: user.name,
        link: `${Env.get('APP_WEB_URL')}/reset_password?token=${token}`,
      },
      message => {
        message
          .to(user.email)
          .from('jonathan.lucas.m@gmail.com')
          .subject('Forgot Password');
      }
    );

    return { message: 'E-mail successfully sent' };
  }
}

module.exports = ForgotPasswordController;
