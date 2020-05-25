const { test, trait } = use('Test/Suite')('Forgot Password');

/** @typedef {import('@adonisjs/lucid/src/Factory/')} */
const Factory = use('Factory');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

const Mail = use('Mail');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should be able send email with reset password instructions', async ({
  assert,
  client,
}) => {
  Mail.fake();

  const email = 'emailtest@test.com';

  const user = await Factory.model('App/Models/User').create({ email });

  const response = await client.post('/forgot').send({ email }).end();

  response.assertStatus(200);

  const token = await user.tokens().first();

  const recentEmail = Mail.pullRecent();

  assert.equal(recentEmail.message.to[0].address, email);

  assert.include(token.toJSON(), { type: 'forgotpassword' });

  Mail.restore();
});

test('it should not be able send email for reset password with non-existing email', async ({
  client,
}) => {
  Mail.fake();

  const forgotPayload = {
    email: 'emailtest@test.com',
  };

  const response = await client.post('/forgot').send(forgotPayload).end();

  response.assertStatus(409);

  response.assertError({
    status: 'error',
    message: 'E-mail not registred',
  });

  Mail.restore();
});

test('it should be able reset password', async ({ assert, client }) => {
  Mail.fake();

  const email = 'emailtest@test.com';

  const user = await Factory.model('App/Models/User').create({ email });

  await client.post('/forgot').send({ email }).end();

  const { token } = await user.tokens().first();

  const response = await client
    .patch('/reset')
    .send({ token, password: '12345', password_confirmation: '12345' })
    .end();
  response.assertStatus(200);

  const updatedUser = await User.findBy('email', email);

  const checkPassword = await Hash.verify('12345', updatedUser.password);

  assert.equal(checkPassword, true);

  Mail.restore();
});
