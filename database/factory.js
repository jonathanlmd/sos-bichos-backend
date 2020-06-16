/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
Factory.blueprint('App/Models/User', (faker, i, data) => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: faker.password(),
    ...data,
  };
});

Factory.blueprint('App/Models/Token', (faker, i, data) => {
  return {
    type: 'bearer',
    token: faker.string({ length: 20 }),
    ...data,
  };
});

Factory.blueprint('App/Models/Address', (faker, i, data) => {
  return {
    public_place: faker.zip({ plusfoour: true }),
    city: faker.city(),
    uf: faker.state({ length: 2 }),
    street: faker.address(),
    district: faker.province(),
    complement: faker.string(),
    ...data,
  };
});

Factory.blueprint('App/Models/Pet', (faker, i, data) => {
  return {
    name: faker.name().split(' ')[0],
    sex: faker.gender(),
    description: faker.string({ length: 20 }),
    rescued_at: faker.date(),
    avatar: faker.avatar(),
    id_owner: null,
    ...data,
  };
});

Factory.blueprint('App/Models/New', (faker, i, data) => {
  return {
    title: faker.word(),
    subtitle: faker.sentence({ words: 5 }),
    body: faker.string({ length: 30 }),
    folder: faker.url(),
    ...data,
  };
});

Factory.blueprint('App/Models/Admin', (faker, i, data) => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: faker.password(),
    ...data,
  };
});
