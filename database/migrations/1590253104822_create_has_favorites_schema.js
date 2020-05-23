'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HasFavorites extends Schema {
  up () {
    this.create('has_favorites', (table) => {
      table.uuid('id').unique().primary().notNullable();
      table
        .uuid('id_user')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      table
        .uuid('id_pet')
        .references('id')
        .inTable('pets')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
    })
  }

  down () {
    this.drop('has_favorites')
  }
}

module.exports = HasFavorites
