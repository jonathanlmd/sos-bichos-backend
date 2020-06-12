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

const { Storage } = require('@google-cloud/storage');

class PetSeeder {
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
    let pets = [...Array(11).keys()];

    await pets.reduce(async (previousPromise, i) => {
      await previousPromise;

      const [metadata] = await storage
        .bucket(uploadConfig.bucket)
        .file(`pets/pet${i + 1}.jpeg`)
        .getMetadata();

      pets[i] = await Factory.model('App/Models/Pet').create({
        avatar: metadata.mediaLink,
      });

      return Promise.resolve();
    }, Promise.resolve());
  }
}

module.exports = PetSeeder;
