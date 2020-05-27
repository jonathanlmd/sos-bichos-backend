/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('Pets');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type{import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able list pets', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  await Factory.model('App/Models/Pet').createMany(15);

  const response = await client
    .get('/pets/?page=1')
    .loginVia(user, 'jwt')
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

  assert.exists(response.body.pets);
  assert.lengthOf(response.body.pets, 10);
});

test('it should not be able to list pets without authentication', async ({
  client,
}) => {
  const response = await client.get('/pets/?page=1').end();

  response.assertStatus(401);
});

test('it should be able to create a new pet', async ({ client, assert }) => {
  const admin = await Factory.model('App/Models/Admin').create();
  const pet = await Factory.model('App/Models/Pet').make();

  const parsedPet = JSON.stringify(pet.toJSON());

  const response = await client
    .post('/pet')
    .field('data', parsedPet)
    .attach('avatar', Helpers.tmpPath('dog_temp.jpeg'))
    .loginVia(admin, 'jwt')
    .end();

  response.assertStatus(200);

  assert.include(response.body, {
    name: pet.name,
    description: pet.description,
    sex: pet.sex,
  });

  assert.isNotNull(response.body.id);
  assert.isNotNull(response.body.avatar);
});

test('it should no be able to create a new pet if user account', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const pet = await Factory.model('App/Models/Pet').make();

  const parsedPet = JSON.stringify(pet.toJSON());

  const response = await client
    .post('/pet')
    .field('data', parsedPet)
    .attach('avatar', Helpers.tmpPath('dog_temp.jpeg'))
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(401);
});
