/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const { uuid } = require('uuidv4');

class HasFavorite extends Model {
  static get table() {
    return 'has_favorites';
  }

  static boot() {
    super.boot();
    this.addHook('beforeCreate', async userInstance => {
      Object.assign(userInstance, {
        id: uuid(),
      });
    });
  }
}

module.exports = HasFavorite;
