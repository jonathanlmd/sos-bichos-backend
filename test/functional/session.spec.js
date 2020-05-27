const { test, trait } = use('Test/Suite')('Session');

/** @typedef {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to login', async ({ assert, client }) => {
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

test('it should not be able to login with wrong email', async ({ client }) => {
  const sessionPayload = {
    email: 'emailtest@test.com',
    password: 'passwordtest',
  };

  await Factory.model('App/Models/User').create(sessionPayload);

  const response = await client
    .post('/session')
    .send({
      email: 'wrongemail@test.com',
      password: sessionPayload.password,
    })
    .end();

  response.assertStatus(401);
  response.assertError({
    status: 'error',
    message: "Email or password don't match",
  });
});

test('it should not be able to login with wrong password', async ({
  client,
}) => {
  const sessionPayload = {
    email: 'emailtest@test.com',
    password: 'passwordtest',
  };

  await Factory.model('App/Models/User').create(sessionPayload);

  const response = await client
    .post('/session')
    .send({
      email: sessionPayload.email,
      password: 'wrong password',
    })
    .end();

  response.assertStatus(401);
  response.assertError([
    { field: 'password', message: 'Invalid user password' },
  ]);
});
