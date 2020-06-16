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

class NewsSeeder {
  async run() {
    await Factory.model('App/Models/New').createMany(5, {
      folder:
        'https://storage.cloud.google.com/sosbichos-test/news/03f5c2fc88f71370bd30-Image.jpg',
    });
  }
}

module.exports = NewsSeeder;
