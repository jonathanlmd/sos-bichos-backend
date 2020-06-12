/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const { uuid } = require('uuidv4');

class New extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeCreate', async userInstance => {
      Object.assign(userInstance, {
        id: uuid(),
      });
    });
  }
}

module.exports = New;
