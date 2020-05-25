/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('Forgot Password');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {import('@adonisjs/mail/src/Mail')} */
const Mail = use('Mail');

const { subHours, parseISO } = require('date-fns');

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
  const email = 'emailtest@test.com';

  const response = await client.post('/forgot').send({ email }).end();

  response.assertStatus(409);

  response.assertError({
    status: 'error',
    message: 'E-mail not registred',
  });
});

test('it should be able reset password', async ({ assert, client }) => {
  const email = 'emailtest@test.com';

  const user = await Factory.model('App/Models/User').create({ email });
  const userToken = await Factory.model('App/Models/Token').make();

  await user.tokens().save(userToken);

  const response = await client
    .patch('/reset')
    .send({
      token: userToken.token,
      password: '12345',
      password_confirmation: '12345',
    })
    .end();

  response.assertStatus(200);

  await user.reload();

  const checkPassword = await Hash.verify('12345', user.password);

  assert.isTrue(checkPassword);
});

test('it should not be able reset password with expired token', async ({
  client,
}) => {
  const email = 'emailtest@test.com';

  const user = await Factory.model('App/Models/User').create({ email });
  const userToken = await Factory.model('App/Models/Token').make();
  await user.tokens().save(userToken);

  userToken.created_at = subHours(new Date(), 3);

  await userToken.save();

  const response = await client
    .patch('/reset')
    .send({
      token: userToken.token,
      password: '12345',
      password_confirmation: '12345',
    })
    .end();
  response.assertStatus(400);
  response.assertError({
    status: 'error',
    message: 'Token expired',
  });
});
