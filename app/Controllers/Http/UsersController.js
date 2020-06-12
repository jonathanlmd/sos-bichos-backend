/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Owner = use('App/Models/Owner');

const StorageProvider = use('My/StorageProvider');

class UsersController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const userData = request.only(['name', 'email', 'password']);

    const user = await User.create(userData);

    if (!user) {
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }

    const { token } = await auth.attempt(userData.email, userData.password);

    return response.json({ user, token });
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async delete({ request, response, auth }) {
    const { password } = request.only(['password']);

    const user = await auth.getUser();

    const matchPassword = auth.validate(user.email, password);

    if (!matchPassword) {
      return response.status(500).json({
        status: 'error',
        message: "Password don't match",
      });
    }

    if (user.avatar) {
      await StorageProvider.deleteFile(`user/${user.avatar}`);
    }

    const adoptionRequests = await user.adoptionsRequests().fetch();

    if (adoptionRequests.rows.length) {
      const owner = new Owner();
      owner.name = user.name;
      owner.email = user.email;
      owner.phone = user.phone;

      Promise.all(
        adoptionRequests.rows.map(async adoptionRequest => {
          if (adoptionRequest.approved) {
            if (!owner.$persisted) {
              await owner.save();
            }
            await adoptionRequest.owner().associate(owner);
          } else {
            await adoptionRequest.delete();
          }
        })
      );
    }

    await user.delete();

    return response.status(204).send();
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async updateAvatar({ request, response, auth }) {
    const user = await auth.getUser();

    const profilePic = request.file('avatar', {
      types: ['image'],
      size: '2mb',
    });

    if (!profilePic) {
      return response.status(400).json({
        status: 'error',
        message: 'Avatar not found',
      });
    }
    profilePic.clientName = `${profilePic.clientName}`;

    const fileName = await StorageProvider.saveFile(profilePic, 'users');

    if (!fileName) {
      return response.status(400).json({
        status: 'error',
        message: 'Was not possible to update avatar',
      });
    }

    if (user.avatar) {
      await StorageProvider.deleteFile(`users/${user.avatar}`);
    }

    user.avatar = fileName;

    await user.save();

    await user.load('address');

    return response.json(user.toJSON());
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, auth }) {
    const {
      name,
      email,
      cellphone_number,
      profession,
      birthdate,
      address,
    } = request.all();
    const { cep, street, city, uf, district, complement } = address;
    const user = await auth.getUser();

    const userAddress = await user.address().fetch();

    if (userAddress) {
      Object.assign(userAddress, {
        public_place: String(cep),
        street,
        city,
        uf,
        district,
        complement,
      });
      await userAddress.save();
    } else {
      await user.address().create({
        public_place: String(cep),
        street,
        city,
        uf,
        district,
        complement,
      });
    }

    Object.assign(user, {
      name,
      email,
      phone: cellphone_number,
      profession,
      birthdate,
    });

    await user.save();

    await user.load('address');

    return response.json(user.toJSON());
  }
}

module.exports = UsersController;
