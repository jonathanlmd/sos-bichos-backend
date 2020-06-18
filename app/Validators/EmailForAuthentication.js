class EmailForAuthentication {
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
    return this.ctx.response.status(400).json({
      status: 'error',
      message: errorMessages[0].message,
    });
  }
}

module.exports = EmailForAuthentication;
