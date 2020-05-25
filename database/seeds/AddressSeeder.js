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
    const users = await Factory.model('App/Models/User').createMany(3);
    const addresses = await Factory.model('App/Models/Address').makeMany(3);

    await users[0].address().save(addresses[0]);
    await users[1].address().save(addresses[1]);
    await users[2].address().save(addresses[2]);
  }
}

module.exports = AddressSeeder;
