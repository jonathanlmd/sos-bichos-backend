/*
|--------------------------------------------------------------------------
| FavoritedPetSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

class FavoritedPetSeeder {
  async run() {
    const pet = await Factory.model('App/Models/Pet').createMany(10);
    const user = await Factory.model('App/Models/User').createMany(5);

    await user[0].favoritePets().attach([pet[0].id, pet[1].id]);
    await user[1].favoritePets().attach([pet[2].id, pet[3].id]);
    await user[2].favoritePets().attach([pet[4].id, pet[5].id]);
    await user[3].favoritePets().attach([pet[6].id, pet[7].id]);
    await user[4].favoritePets().attach([pet[8].id, pet[9].id]);
  }
}

module.exports = FavoritedPetSeeder;
