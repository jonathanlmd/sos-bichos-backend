/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('Adverts');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const { uuid } = require('uuidv4');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to create a new advert relationship', async ({
  assert,
  client,
}) => {
  const pet = await Factory.model('App/Models/Pet').create();
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post(`/user/ads/${pet.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.deepEqual(response.body, {
    totalPetsHelpeds: 1,
    adsSeen: 1,
  });
});

test('it should be able to increment ads seen if advert relationship already exists', async ({
  assert,
  client,
}) => {
  const pet = await Factory.model('App/Models/Pet').create();
  const user = await Factory.model('App/Models/User').create();

  await client.post(`/user/ads/${pet.id}`).loginVia(user, 'jwt').end();

  const response = await client
    .post(`/user/ads/${pet.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.deepEqual(response.body, {
    totalPetsHelpeds: 1,
    adsSeen: 2,
  });
});

test('it should not be able to create a new advert relationship with invalid pet id', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post(`/user/ads/${uuid()}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);

  assert.deepEqual(response.body, {
    status: 'error',
    message: 'Pet not found',
  });
});

test('it should be able to get number of ads seen and pets helpeds', async ({
  assert,
  client,
}) => {
  const pets = await Factory.model('App/Models/Pet').createMany(3);
  const user = await Factory.model('App/Models/User').create();

  await client.post(`/user/ads/${pets[0].id}`).loginVia(user, 'jwt').end();
  await client.post(`/user/ads/${pets[1].id}`).loginVia(user, 'jwt').end();
  await client.post(`/user/ads/${pets[2].id}`).loginVia(user, 'jwt').end();
  await client.post(`/user/ads/${pets[2].id}`).loginVia(user, 'jwt').end();

  const response = await client.get('/user/ads/').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.deepEqual(response.body, {
    totalPetsHelpeds: 3,
    adsSeen: 4,
  });
});
