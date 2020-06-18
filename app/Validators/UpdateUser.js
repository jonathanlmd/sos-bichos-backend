class UpdateUser {
  get rules() {
    return {
      name: 'required',
      email: 'required|email',
      birthdate: 'required',
    };
  }

  get messages() {
    return {
      'email.required': 'E-mail is required',
      'email.email': 'Invalid e-mail',
      'name.required': 'Name is required',
      'birthdate.required': 'Birthdate is required',
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json({
      status: 'error',
      message: errorMessages[0].message,
    });
  }
}

module.exports = UpdateUser;
