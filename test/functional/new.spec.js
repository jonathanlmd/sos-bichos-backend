/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('New');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type{import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('it should be able to create a new', async ({ client, assert }) => {
  const admin = await Factory.model('App/Models/Admin').create();

  const data = {
    title: 'title test',
    subtitle: 'a subtitle',
    body: 'this is a new',
  };
  const parsedData = JSON.stringify(data);

  const response = await client
    .post('/news')
    .field('data', parsedData)
    .attach('folder', Helpers.tmpPath('dog_temp.jpeg'))
    .loginVia(admin, 'jwt')
    .end();

  response.assertStatus(200);

  assert.nestedInclude(response.body, data);

  assert.isNotNull(response.body.id);
  assert.isNotNull(response.body.folder);
});

test('it should not be able to create a new without folder', async ({
  client,
  assert,
}) => {
  const admin = await Factory.model('App/Models/Admin').create();

  const data = {
    title: 'title test',
    subtitle: 'a subtitle',
    body: 'this is a new',
  };
  const parsedData = JSON.stringify(data);

  const response = await client
    .post('/news')
    .field('data', parsedData)
    .loginVia(admin, 'jwt')
    .end();

  response.assertStatus(409);
});

test('it should be able to list news', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  const news = await Factory.model('App/Models/New').createMany(5);

  const response = await client.get('/news').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.lengthOf(response.body, 5);

  assert.equal(response.body[0].id, news[0].id);
  assert.equal(response.body[1].id, news[1].id);
  assert.equal(response.body[2].id, news[2].id);
  assert.equal(response.body[3].id, news[3].id);
  assert.equal(response.body[4].id, news[4].id);
});
