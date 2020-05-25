/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class Users extends Schema {
  up() {
    this.create('users', table => {
      table.uuid('id').unique().primary().notNullable();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.string('occupation');
      table.date('birthdate');
      table.timestamps(true);
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = Users;
