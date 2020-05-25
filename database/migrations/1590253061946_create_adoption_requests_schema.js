/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AdoptionRequests extends Schema {
  up() {
    this.create('adoption_requests', table => {
      table.uuid('id').unique().primary().notNullable();
      table.boolean('approved').notNullable().defaultTo(false);
      table.boolean('completed').notNullable().defaultTo(false);
      table.string('observations');
      table
        .uuid('id_user_owner')
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
