'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class Admins extends Schema {
  up () {
    this.create('admins', (table) => {
      table.uuid('id').unique().primary().notNullable();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.timestamps(true);
    })
  }

  down () {
    this.drop('admins')
  }
}

module.exports = Admins
