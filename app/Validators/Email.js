class Email {
  get rules() {
    return {
      email: 'required|email',
    };
  }

  get messages() {
    return {
      'email.required': 'E-mail is required',
      'email.email': 'Invalid e-mail',
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.json(errorMessages);
  }
}

module.exports = Email;
