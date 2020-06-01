/*
|--------------------------------------------------------------------------
| PetSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

class PetSeeder {
  async run() {
    // eslint-disable-next-line prefer-const
    let pets = [...Array(11).keys()];

    await pets.reduce(async (previousPromise, i) => {
      await previousPromise;

      pets[i] = await Factory.model('App/Models/Pet').create({
        avatar: `https://storage.cloud.google.com/sosbichos-test/pet${i}.jpeg`,
      });

      return Promise.resolve();
    }, Promise.resolve());
  }
}

module.exports = PetSeeder;
