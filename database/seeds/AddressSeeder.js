/*
|--------------------------------------------------------------------------
| AddressSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

class AddressSeeder {
  async run() {
    const user = await Factory.model('App/Models/User').create();
    const address = await Factory.model('App/Models/Address').make();

    await user.address().save(address);
  }
}

module.exports = AddressSeeder;
