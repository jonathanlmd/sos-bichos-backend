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

const { Storage } = require('@google-cloud/storage');

class FavoritedPetSeeder {
  async run() {
    const uploadConfig = use('Adonis/Src/Config').get('drive.disks.gcs');
    const storage = new Storage({
      projectId: uploadConfig.projectId,
      region: uploadConfig.region,
      credentials: {
        client_email: uploadConfig.clientEmail,
        private_key: uploadConfig.privateKey,
      },
    });

    // eslint-disable-next-line prefer-const
    let pets = [...Array(10).keys()];

    await pets.reduce(async (previousPromise, i) => {
      await previousPromise;

      const [metadata] = await storage
        .bucket(uploadConfig.bucket)
        .file(`pet${i + 12}.jpeg`)
        .getMetadata();

      pets[i] = await Factory.model('App/Models/Pet').create({
        avatar: metadata.mediaLink,
      });

      return Promise.resolve();
    }, Promise.resolve());

    const user = await Factory.model('App/Models/User').createMany(5);

    await user[0].favoritePets().attach([pets[0].id, pets[1].id]);
    await user[1].favoritePets().attach([pets[2].id, pets[3].id]);
    await user[2].favoritePets().attach([pets[4].id, pets[5].id]);
    await user[3].favoritePets().attach([pets[6].id, pets[7].id]);
    await user[4].favoritePets().attach([pets[8].id, pets[9].id]);
  }
}

module.exports = FavoritedPetSeeder;
