/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class Pets extends Schema {
  up() {
    this.create('pets', table => {
      table.uuid('id').unique().primary().notNullable();
      table.string('name').notNullable();
      table.string('sex').notNullable();
      table.string('description');
      table.string('avatar').notNullable();
      table
        .uuid('id_owner')
        .references('id')
        .inTable('owners')
        .defaultTo(null)
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
      table.date('rescued_at').notNullable();
      table.timestamps(true);
    });
  }

  down() {
    this.drop('pets');
  }
}

module.exports = Pets;
