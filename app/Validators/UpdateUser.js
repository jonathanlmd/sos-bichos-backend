class UpdateUser {
  get rules() {
    return {
      name: 'required',
      email: 'required|email',
      birthdate: 'required',
    };
  }
}

module.exports = UpdateUser;
