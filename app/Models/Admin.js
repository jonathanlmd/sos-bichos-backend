/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Hash = use('Hash');

const { uuid } = require('uuidv4');

class Admin extends Model {
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
}

module.exports = Admin;
