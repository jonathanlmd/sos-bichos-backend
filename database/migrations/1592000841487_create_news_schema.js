/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CreateNewsSchema extends Schema {
  up() {
    this.create('news', table => {
      table.uuid('id').unique().primary().notNullable();
      table.string('title').notNullable();
      table.string('subtitle').notNullable();
      table.string('body').notNullable();
      table.string('folder').notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('news');
  }
}

module.exports = CreateNewsSchema;
