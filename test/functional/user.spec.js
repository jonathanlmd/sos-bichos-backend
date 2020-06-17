const { test, trait } = use('Test/Suite')('User');
const fs = require('fs');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {import('@adonisjs//ignitor/src/Helpers')} */
const Helpers = use('Helpers');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const AdoptionRequest = use('App/Models/AdoptionRequest');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

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
  assert,
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
      password_confirmation: 'passwordtest',
    })
    .end();

  response.assertStatus(409);
  assert.deepInclude(response.body.errors, {
    title: 'unique',
    detail: 'This E-mail already exist',
    source: { pointer: 'email' },
  });
});

test('it should be able to delete an user', async ({ client }) => {
  const user = await User.create({
    name: 'User test 1',
    email: 'emailtest@test.com',
    password: 'passwordtest',
  });

  const response = await client
    .delete('/user')
    .send({ id: user.id, password: 'passwordtest' })
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
});

test('it should not be able to delete an user without confirm correct password', async ({
  client,
}) => {
  const user = await User.create({
    name: 'User test 1',
    email: 'emailtest@test.com',
    password: 'passwordtest',
  });

  const response = await client
    .delete('/user')
    .send({ id: user.id, password: 'wrongpassword' })
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(401);
});

test('it should be able delete avatar when delete user', async ({
  client,
  assert,
}) => {
  const user = await User.create({
    name: 'User test 1',
    email: 'emailtest@test.com',
    password: 'passwordtest',
  });

  await client
    .patch('/user/avatar')
    .attach('avatar', Helpers.tmpPath('dog_temp.jpeg'))
    .loginVia(user, 'jwt')
    .end();

  await user.reload();

  const response = await client
    .delete('/user')
    .send({ id: user.id, password: 'passwordtest' })
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  assert.isFalse(
    fs.existsSync(`${Helpers.tmpPath()}/uploads/users/${user.avatar}`)
  );
});

test('it should be able to delete only adoption incompleted adoption requests when delete user', async ({
  client,
  assert,
}) => {
  const pets = await Factory.model('App/Models/Pet').createMany(2);
  const user = await Factory.model('App/Models/User').create({
    name: 'Fulano',
    email: 'fulano@test.com',
    password: 'passwordtest',
  });

  await AdoptionRequest.create({
    id_user: user.id,
    id_pet: pets[0].id,
  });
  const adoptionRequest = await AdoptionRequest.create({
    id_user: user.id,
    id_pet: pets[1].id,
  });

  adoptionRequest.approved = true;
  adoptionRequest.completed = true;

  await adoptionRequest.save();

  const response = await client
    .delete('/user')
    .send({ id: user.id, password: 'passwordtest' })
    .loginVia(user, 'jwt')
    .end();

  const adoptionResquests = await AdoptionRequest.all();
  assert.lengthOf(adoptionResquests.rows, 1);
  assert.strictEqual(adoptionResquests.rows[0].id, adoptionRequest.id);

  response.assertStatus(204);
});

test('it should not be able update avatar without profile pic', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'Fulano',
    email: 'fulano@test.com',
    password: 'passwordtest',
  });

  const response = await client
    .patch('/user/avatar')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);

  response.assertError({
    status: 'error',
    message: 'Avatar not found',
  });
});

test('it should be able to update avatar profile', async ({
  client,
  assert,
}) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'Fulano',
    email: 'fulano@test.com',
    password: 'passwordtest',
  });

  const response = await client
    .patch('/user/avatar')
    .attach('avatar', Helpers.tmpPath('dog_temp.jpeg'))
    .loginVia(user, 'jwt')
    .end();

  await user.reload();

  response.assertStatus(200);

  assert.nestedInclude(response.body, user.toJSON());
});

test('it should be able to delete old avatar when update', async ({
  client,
  assert,
}) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'Fulano',
    email: 'fulano@test.com',
    password: 'passwordtest',
  });

  await client
    .patch('/user/avatar')
    .attach('avatar', Helpers.tmpPath('dog_temp.jpeg'))
    .loginVia(user, 'jwt')
    .end();

  await user.reload();
  const oldAvatar = user.avatar;

  const response = await client
    .patch('/user/avatar')
    .attach('avatar', Helpers.tmpPath('dog_temp.jpeg'))
    .loginVia(user, 'jwt')
    .end();

  await user.reload();

  response.assertStatus(200);

  assert.isFalse(
    fs.existsSync(`${Helpers.tmpPath()}/uploads/users/${oldAvatar}`)
  );
  assert.isTrue(
    fs.existsSync(`${Helpers.tmpPath()}/uploads/users/${user.avatar}`)
  );
});

test('it should be able to update profile data', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'Fulano',
    email: 'fulano@test.com',
    password: 'passwordtest',
  });

  const birthdate = new Date(1997, 5, 5);
  const data = {
    name: 'Nome Teste',
    email: 'emailtest@test.com',
    cellphone: '420000000',
    profession: 'teste',
    birthdate: String(birthdate.toISOString()),
    address: {
      cep: 84052689,
      logradouro: 'Av. Brasil',
      localidade: 'TestCity',
      uf: 'TS',
      bairro: 'Testing',
      complemento: 'Casa',
      numero: 125,
    },
  };

  const response = await client
    .put('/user')
    .send(data)
    .loginVia(user, 'jwt')
    .end();

  await user.reload();

  response.assertStatus(200);
  const parsedUser = user.toJSON();
  Object.assign(parsedUser, { cellphone: parsedUser.phone });
  delete parsedUser.birthdate;
  delete parsedUser.phone;

  assert.nestedInclude(response.body, parsedUser);
});

test('it should be able to update profile data with existent address', async ({
  client,
  assert,
}) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'Fulano',
    email: 'fulano@test.com',
    password: 'passwordtest',
  });

  const address = await Factory.model('App/Models/Address').make();

  await user.address().save(address);

  const birthdate = new Date(1997, 5, 5);
  const data = {
    name: 'Nome Teste',
    email: 'emailtest@test.com',
    cellphone: '420000000',
    profession: 'teste',
    birthdate: String(birthdate.toISOString()),
    address: {
      cep: 84052689,
      logradouro: 'Av. Brasil',
      localidade: 'TestCity',
      uf: 'TS',
      bairro: 'Testing',
      complemento: 'Casa',
      numero: 125,
    },
  };

  const response = await client
    .put('/user')
    .send(data)
    .loginVia(user, 'jwt')
    .end();

  await user.reload();

  response.assertStatus(200);
  const parsedUser = user.toJSON();
  Object.assign(parsedUser, { cellphone: parsedUser.phone });
  delete parsedUser.birthdate;
  delete parsedUser.phone;

  assert.nestedInclude(response.body, parsedUser);
});
