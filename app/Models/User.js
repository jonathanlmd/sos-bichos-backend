/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

const { uuid } = require('uuidv4');

class User extends Model {
  static boot() {
    super.boot();

    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        const password = await Hash.make(userInstance.password);
        Object.assign(userInstance, { password });
      }
    });

    this.addHook('beforeCreate', async userInstance => {
      Object.assign(userInstance, {
        id: uuid(),
      });
    });
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token', 'id', 'id_user');
  }

  address() {
    return this.hasOne('App/Models/Address', 'id', 'id_user');
  }

  favoritePets() {
    return this.belongsToMany(
      'App/Models/Pet',
      'id_user',
      'id_pet',
      'id',
      'id'
    ).pivotModel('App/Models/HasFavorite');
  }

  static get hidden() {
    return ['password'];
  }
}

module.exports = User;
