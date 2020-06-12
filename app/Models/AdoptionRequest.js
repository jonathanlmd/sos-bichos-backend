/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const { uuid } = require('uuidv4');

class AdoptionRequest extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeCreate', async userInstance => {
      Object.assign(userInstance, {
        id: uuid(),
      });
    });
  }

  user() {
    return this.belongsTo('App/Models/User', 'id_user', 'id');
  }

  owner() {
    return this.belongsTo('App/Models/Owner', 'id_owner', 'id');
  }

  pet() {
    return this.belongsTo('App/Models/Pet', 'id_pet', 'id');
  }
}

module.exports = AdoptionRequest;
