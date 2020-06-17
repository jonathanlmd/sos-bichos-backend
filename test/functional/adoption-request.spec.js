/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('Adoption Request');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const AdoptionRequest = use('App/Models/AdoptionRequest');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to create an adoption request', async ({
  client,
  assert,
}) => {
  const pet = await Factory.model('App/Models/Pet').create();
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/user/adoption/request/')
    .send({ user_id: user.id, pet_id: pet.id })
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.hasAllKeys(response.body, ['adoptionRequest', 'user_id', 'pet_id']);
  assert.equal(response.body.user_id, user.id);
  assert.equal(response.body.pet_id, pet.id);
});

test('it should be able to list all adoption requests', async ({
  client,
  assert,
}) => {
  const pets = await Factory.model('App/Models/Pet').createMany(15);
  const admin = await Factory.model('App/Models/Admin').create();
  const user = await Factory.model('App/Models/User').create();

  await AdoptionRequest.createMany(
    pets.map(pet => {
      return { id_user: user.id, id_pet: pet.id };
    })
  );

  const response = await client
    .get('/adoption/requests/')
    .loginVia(admin, 'jwt')
    .end();

  response.assertStatus(200);

  assert.deepInclude(response.body, {
    pagination: {
      total: '15',
      perPage: 10,
      lastPage: 2,
      page: 1,
    },
  });

  assert.exists(response.body.adoption_requests);
  assert.lengthOf(response.body.adoption_requests, 10);
});

test('it should not be able to create an adoption request with invalid pet', async ({
  client,
  assert,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/user/adoption/request/')
    .send({ user_id: user.id, pet_id: '82cd745e-09af-4e6f-95eb-cd03ae824deb' })
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);
  response.assertError({
    status: 'error',
    message: 'Pet not found',
  });
});
