const { uuid } = require('uuidv4');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Owner extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeCreate', async userInstance => {
      Object.assign(userInstance, {
        id: uuid(),
      });
    });
  }
}

module.exports = Owner;
