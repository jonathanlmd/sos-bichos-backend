/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('List Pets');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

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
