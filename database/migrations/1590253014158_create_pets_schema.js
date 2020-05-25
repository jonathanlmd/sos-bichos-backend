/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class Pets extends Schema {
  up() {
    this.create('pets', table => {
      table.uuid('id').unique().primary().notNullable();
      table.string('name').notNullable();
      table.string('sex').notNullable();
      table.string('description');
      table
        .uuid('id_user_owner')
        .references('id')
        .inTable('users')
        .defaultTo(null)
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.date('rescued_at').notNullable();
      table.date('birthdate').defaultTo(null);
      table.timestamps(true);
    });
  }

  down() {
    this.drop('pets');
  }
}

module.exports = Pets;
