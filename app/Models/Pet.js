/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

const { uuid } = require('uuidv4');

class Pet extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeCreate', async userInstance => {
      Object.assign(userInstance, {
        id: uuid(),
      });
    });
  }

  usersWhoFavored() {
    return this.belongsToMany(
      'App/Models/User',
      'id_pet',
      'id_user',
      'id',
      'id'
    ).pivotModel('App/Models/HasFavorite');
  }

  usersWhoSaveMe() {
    return this.belongsToMany(
      'App/Models/User',
      'id_pet',
      'id_user',
      'id',
      'id'
    ).pivotModel('App/Models/Advert');
  }

  owner() {
    return this.belongsTo('App/Models/Owner', 'id_owner', 'id');
  }
}

module.exports = Pet;
