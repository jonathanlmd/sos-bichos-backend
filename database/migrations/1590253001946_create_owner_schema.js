/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class Owners extends Schema {
  up() {
    this.create('owners', table => {
      table.uuid('id').unique().primary().notNullable();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('phone');
      table.timestamps();
    });
  }

  down() {
    this.drop('owners');
  }
}

module.exports = Owners;
