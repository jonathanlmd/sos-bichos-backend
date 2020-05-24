const { test, trait } = use('Test/Suite')('Session');

/** @typedef {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to login with an existing user', async ({
  assert,
  client,
}) => {
  const sessionPayload = {
    email: 'emailtest@test.com',
    password: 'passwordtest',
  };

  await Factory.model('App/Models/User').create(sessionPayload);

  const response = await client.post('/session').send(sessionPayload).end();

  response.assertStatus(200);

  assert.exists(response.body.user);
  assert.exists(response.body.token);
});
