/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('Session Admin');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to login as Admin', async ({ client, assert }) => {
  const admin = await Factory.model('App/Models/Admin').create({
    password: 'passwordtest',
  });

  const response = await client
    .post('/session/adm')
    .send({ email: admin.email, password: 'passwordtest' })
    .end();

  response.assertStatus(200);

  assert.hasAllKeys(response.body, ['token', 'user']);
});

test('it should not be able to login as Admin with wron email or password', async ({
  client,
}) => {
  const admin = await Factory.model('App/Models/Admin').create({
    email: 'email@test.com',
    password: 'passwordtest',
  });

  const responseWithWrongPassword = await client
    .post('/session/adm')
    .send({ email: admin.email, password: 'wrongpassword' })
    .end();
  const responseWithWrongEmail = await client
    .post('/session/adm')
    .send({ email: 'wrong@email.com', password: 'passwordtest' })
    .end();

  responseWithWrongPassword.assertStatus(401);
  responseWithWrongEmail.assertStatus(401);
  responseWithWrongEmail.assertError({
    status: 'error',
    message: "Email or password don't match",
  });
});

test('it should not be able to login as Admin without email or with invalid email', async ({
  client,
  assert,
}) => {
  const responseWithInvalidEmail = await client
    .post('/session/adm')
    .send({ email: 'invalid email', password: 'passwordtest' })
    .end();
  const responseWithoutEmail = await client
    .post('/session/adm')
    .send({ password: 'passwordtest' })
    .end();

  responseWithInvalidEmail.assertStatus(400);
  responseWithoutEmail.assertStatus(400);

  assert.deepEqual(responseWithInvalidEmail.body, {
    status: 'error',
    message: 'Invalid e-mail',
  });
  assert.deepEqual(responseWithoutEmail.body, {
    status: 'error',
    message: 'E-mail is required',
  });
});
