/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('Favorite');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const { uuid } = require('uuidv4');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to favor a pet', async ({ assert, client }) => {
  const pet = await Factory.model('App/Models/Pet').create();
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .patch(`/user/favorite/${pet.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  await user.reload();
  const pets = await user.favoritePets().fetch();

  assert.lengthOf(pets.toJSON(), 1);

  assert.include(response.body, {
    id: pet.id,
    name: pet.name,
    sex: pet.sex,
    description: pet.description,
  });
});

test('it should not be able to favor a pet if is not logged', async ({
  client,
}) => {
  const pet = await Factory.model('App/Models/Pet').create();

  const response = await client.patch(`/user/favorite/${pet.id}`).end();

  response.assertStatus(401);
});

test('it should not be able to favor a pet with invalid pet id', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .patch(`/user/favorite/${uuid()}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);

  response.assertJSONSubset({
    status: 'error',
    message: 'Pet not found',
  });
});

test('it should be able to disfavor a pet', async ({ client }) => {
  const pet = await Factory.model('App/Models/Pet').create();
  const user = await Factory.model('App/Models/User').create();
  await user.favoritePets().attach(pet.id);

  const response = await client
    .delete(`/user/disfavor/${pet.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
});

test('it should be able to list favorite pets from an user', async ({
  client,
  assert,
}) => {
  const pets = await Factory.model('App/Models/Pet').createMany(3);
  const user = await Factory.model('App/Models/User').create();

  await user.favoritePets().attach(pets[0].id);
  await user.favoritePets().attach(pets[1].id);
  await user.favoritePets().attach(pets[2].id);

  const response = await client
    .get('/user/favorites/?page=1')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.deepInclude(response.body, {
    pagination: {
      total: '3',
      perPage: 10,
      lastPage: 1,
      page: 1,
    },
  });

  assert.exists(response.body.pets);
  assert.lengthOf(response.body.pets, 3);
});

test('it should not be able to list favorite pets if is not logged', async ({
  client,
}) => {
  const response = await client.get('/user/favorites/?page=1').end();

  response.assertStatus(401);
});
