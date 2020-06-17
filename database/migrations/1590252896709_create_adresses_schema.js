/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class Addresses extends Schema {
  up() {
    this.create('addresses', table => {
      table.uuid('id').unique().primary().notNullable();
      table
        .uuid('id_user')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.string('public_place').notNullable();
      table.string('city').notNullable();
      table.string('street').notNullable();
      table.string('number').notNullable();
      table.string('uf').notNullable();
      table.string('district').notNullable();
      table.string('complement');
      table.timestamps(true);
    });
  }

  down() {
    this.drop('addresses');
  }
}

module.exports = Addresses;
