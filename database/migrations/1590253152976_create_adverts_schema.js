/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class Adverts extends Schema {
  up() {
    this.create('adverts', table => {
      table.uuid('id').unique().primary().notNullable();
      table.integer('times').notNullable().defaultTo(1);
      table
        .uuid('id_user')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
        .notNullable();
      table
        .uuid('id_pet')
        .references('id')
        .inTable('pets')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
        .notNullable();
      table.timestamps(false);
    });
  }

  down() {
    this.drop('adverts');
  }
}

module.exports = Adverts;
