/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

const { uuid } = require('uuidv4');

class Address extends Model {
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
}

module.exports = Address;
