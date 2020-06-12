/*
|--------------------------------------------------------------------------
| AdoptionRequestSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const AdoptionRequest = use('App/Models/AdoptionRequest');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Owner = use('App/Models/Owner');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

class AdoptionRequestSeeder {
  async run() {
    const pet = await Factory.model('App/Models/Pet').create();
    const user = await Factory.model('App/Models/User').create({
      name: 'Fulano',
      email: 'fulano@test.com',
      password: '12345',
    });

    const adoptionRequest = await AdoptionRequest.create({
      id_user: user.id,
      id_pet: pet.id,
    });
    await AdoptionRequest.create({
      id_user: user.id,
      id_pet: pet.id,
    });

    adoptionRequest.approved = true;
    adoptionRequest.completed = true;

    adoptionRequest.save();
  }
}

module.exports = AdoptionRequestSeeder;
