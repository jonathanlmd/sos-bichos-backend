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
    // eslint-disable-next-line prefer-const
    let pets = [...Array(10).keys()];

    await pets.reduce(
      async (previousPromise, i) => {
        await previousPromise;

        pets[i] = await Factory.model('App/Models/Pet').create({
          avatar: `https://storage.cloud.google.com/sosbichos-test/pet${
            i + 11
          }.jpeg`,
        });

        return Promise.resolve();
      },
      { previousPromise: Promise.resolve(), increment: 11 }
    );

    const user = await Factory.model('App/Models/User').createMany(5);

    await user[0].favoritePets().attach([pets[0].id, pets[1].id]);
    await user[1].favoritePets().attach([pets[2].id, pets[3].id]);
    await user[2].favoritePets().attach([pets[4].id, pets[5].id]);
    await user[3].favoritePets().attach([pets[6].id, pets[7].id]);
    await user[4].favoritePets().attach([pets[8].id, pets[9].id]);
  }
}

module.exports = FavoritedPetSeeder;
