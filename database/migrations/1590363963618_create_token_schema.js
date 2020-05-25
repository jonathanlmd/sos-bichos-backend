/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class Tokens extends Schema {
  up() {
    this.create('tokens', table => {
      table.uuid('id').unique().primary().notNullable();
      table
        .uuid('id_user')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.string('token', 255).notNullable().unique().index();
      table.string('type', 80).notNullable();
      table.boolean('is_revoked').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('tokens');
  }
}

module.exports = Tokens;
