const { formatters } = use('Validator');

class EmailExistent {
  get rules() {
    return {
      email: 'required|email|unique:users,email',
    };
  }

  get messages() {
    return {
      'email.required': 'E-mail is required',
      'email.email': 'Invalid e-mail',
      'email.unique': 'This E-mail already exist',
    };
  }

  get formatter() {
    return formatters.JsonApi;
  }

  async fails(errorMessages) {
    return this.ctx.response.status(409).json(errorMessages);
  }
}

module.exports = EmailExistent;
