const { formatters } = use('Validator');

class CreateUser {
  get rules() {
    return {
      email: 'required|email|unique:users,email',
      password: 'required',
      password_confirmation: 'required|same:password',
    };
  }

  get messages() {
    return {
      'email.required': 'E-mail is required',
      'email.email': 'Invalid e-mail',
      'email.unique': 'This E-mail already exist',
      'password.required': 'Password is required',
      'password_confirmation.required': 'Password confirmation is required',
      'password_confirmation.same': "Password and confirmation don't match",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json({
      status: 'error',
      message: errorMessages[0].message,
    });
  }
}

module.exports = CreateUser;
