/*
|--------------------------------------------------------------------------
| NewsSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const { Storage } = require('@google-cloud/storage');

class NewsSeeder {
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

    const [metadata] = await storage
      .bucket(uploadConfig.bucket)
      .file(`news/03f5c2fc88f71370bd30-Image.jpg`)
      .getMetadata();

    await Factory.model('App/Models/New').createMany(5, {
      folder: metadata.mediaLink,
    });
  }
}

module.exports = NewsSeeder;
