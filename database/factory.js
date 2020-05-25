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
    type: data.type || 'bearer',
    token: faker.string({ length: 20 }),
    ...data,
  };
});

Factory.blueprint('App/Models/Address', (faker, i, data) => {
  return {
    public_place: faker.address(),
    city: faker.city(),
    uf: faker.state({ length: 2 }),
    country: faker.country(),
    ...data,
  };
});

Factory.blueprint('App/Models/Pet', (faker, i, data) => {
  return {
    name: faker.name(),
    sex: faker.gender(),
    description: faker.string({ length: 20 }),
    rescued_at: faker.date(),
    birthdate: faker.date(),
    id_user_owner: null,
    ...data,
  };
});
