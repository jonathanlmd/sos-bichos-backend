const { test, trait } = use('Test/Suite')('Session');

/** @typedef {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const nock = require('nock');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to login as user', async ({ assert, client }) => {
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

test('it should be able to refresh token', async ({ assert, client }) => {
  const sessionPayload = {
    email: 'emailtest@test.com',
    password: 'passwordtest',
  };

  await Factory.model('App/Models/User').create(sessionPayload);

  const response = await client.post('/session').send(sessionPayload).end();
  const finalResponse = await client
    .post('/session')
    .header('authorization', `Bearer ${response.body.token.refreshToken}`)
    .end();

  finalResponse.assertStatus(200);
  assert.exists(finalResponse.body.token.token);
  assert.exists(finalResponse.body.token.refreshToken);
  assert.equal(finalResponse.body.token.token, response.body.token.token);
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

test('it should not be able to login without email or password', async ({
  client,
}) => {
  const sessionPayload = {
    email: 'emailtest@test.com',
    password: 'passwordtest',
  };

  await Factory.model('App/Models/User').create(sessionPayload);

  const responseWithoutPassword = await client
    .post('/session')
    .send({
      email: sessionPayload.email,
    })
    .end();
  const responseWithoutEmail = await client
    .post('/session')
    .send({
      password: sessionPayload.password,
    })
    .end();

  responseWithoutEmail.assertStatus(401);
  responseWithoutPassword.assertStatus(401);
  responseWithoutEmail.assertError({
    status: 'error',
    message: 'Email and password are requerid',
  });
  responseWithoutPassword.assertError({
    status: 'error',
    message: 'Email and password are requerid',
  });
});

test('it should be able to login as user with social', async ({
  assert,
  client,
}) => {
  nock('https://www.googleapis.com/').get('/oauth2/v3/userinfo').reply(200, {
    sub: 'fake sub',
    name: 'fake name',
    email: 'fake@email.com',
    picture: 'path fake to picture',
  });

  const sessionPayload = {
    provider: 'google',
    fakeToken:
      'ya29.a0AfH6SMB9Bbzo2Xj2FUUmgokSwbPN7nDoQ8nWHOtNKtVc6TZrH3KIFJlaV_josh6XXLTkED5ocH55g2x-UDcwTFC7AeRVd5CaCsIvjLPLR5Z3B1QopKhzrykhRtzve00nEgFsInGZ6JdjHa2JWKY9JmRIm0Nb-pRXWnVP',
  };

  const response = await client
    .post('/session/social')
    .send({
      provider: sessionPayload.provider,
      accessToken: sessionPayload.fakeToken,
    })
    .end();

  response.assertStatus(200);

  assert.exists(response.body.user);
  assert.exists(response.body.token);
});

test('it should not be able to login as user with invalid social token', async ({
  client,
}) => {
  nock('https://www.googleapis.com/').get('/oauth2/v3/userinfo').reply(401);

  const sessionPayload = {
    provider: 'google',
    fakeToken: 'fake token',
  };

  const response = await client
    .post('/session/social')
    .send({
      provider: sessionPayload.provider,
      accessToken: sessionPayload.fakeToken,
    })
    .end();

  response.assertStatus(400);
  response.assertError({
    status: 'error',
    message: 'Unable to authenticate. Try again later',
  });
});

test('it should be able to refresh token as user with social', async ({
  assert,
  client,
}) => {
  const sessionPayload = {
    email: 'emailtest@test.com',
    password: 'passwordtest',
  };

  await Factory.model('App/Models/User').create(sessionPayload);

  const response = await client.post('/session').send(sessionPayload).end();

  const finalResponse = await client
    .post('/session/social')
    .header('authorization', `Bearer ${response.body.token.refreshToken}`)
    .end();

  finalResponse.assertStatus(200);

  assert.exists(finalResponse.body.token.token);
  assert.exists(finalResponse.body.token.refreshToken);
  assert.equal(finalResponse.body.token.token, response.body.token.token);
});
