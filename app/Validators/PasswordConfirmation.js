class PasswordConfirmation {
  get rules() {
    return {
      password: 'required',
      password_confirmation: 'required|same:password',
    };
  }

  get messages() {
    return {
      'password.required': 'Password is required',
      'password_confirmation.required': 'Password confirmation is required',
      'password_confirmation.same': "Password and confirmation don't match",
    };
  }
}

module.exports = PasswordConfirmation;
