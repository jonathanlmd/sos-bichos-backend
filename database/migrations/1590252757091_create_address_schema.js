/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class Addresses extends Schema {
  up() {
    this.create('addresses', table => {
      table.uuid('id').unique().primary().notNullable();
      table.string('public_place').notNullable();
      table.string('city').notNullable();
      table.string('uf').notNullable();
      table.string('country').notNullable();
      table.string('complement');
      table.timestamps(true);
    });
  }

  down() {
    this.drop('addresses');
  }
}

module.exports = Addresses;
