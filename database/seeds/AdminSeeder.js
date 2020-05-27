/*
|--------------------------------------------------------------------------
| AdminSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

class AdminSeeder {
  async run() {
    await Factory.model('App/Models/Admin').create({
      email: 'admin@email.com',
      password: 'admin',
    });
  }
}

module.exports = AdminSeeder;
