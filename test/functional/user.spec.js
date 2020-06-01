const { test, trait } = use('Test/Suite')('User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should be able to create a new user', async ({ assert, client }) => {
  const response = await client
    .post('/user/create')
    .send({
      name: 'User test',
      email: 'emailtest@test.com',
      password: 'passwordtest',
    })
    .end();

  response.assertStatus(200);

  assert.exists(response.body.user);
  assert.exists(response.body.token);
});

test('it should not be able to create a new user with duplicate email ', async ({
  client,
}) => {
  await User.create({
    name: 'User test 1',
    email: 'emailtest@test.com',
    password: 'passwordtest',
  });

  const response = await client
    .post('/user/create')
    .send({
      name: 'User test 2',
      email: 'emailtest@test.com',
      password: 'passwordtest',
    })
    .end();

  response.assertStatus(409);
});
