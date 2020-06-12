/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AdoptionRequests extends Schema {
  up() {
    this.create('adoption_requests', table => {
      table.uuid('id').unique().primary().notNullable();
      table.boolean('approved').notNullable().defaultTo(false);
      table.boolean('completed').notNullable().defaultTo(false);
      table.string('observations').defaultTo(null);
      table
        .uuid('id_user')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table
        .uuid('id_owner')
        .references('id')
        .inTable('owners')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
        .defaultTo(null);
      table
        .uuid('id_pet')
        .references('id')
        .inTable('pets')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
        .notNullable();
      table.date('approved_at');
      table.date('concluded_at');
      table.timestamps(true);
    });
  }

  down() {
    this.drop('adoption_requests');
  }
}

module.exports = AdoptionRequests;
