/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', ({ response }) => {
  return response.json({
    Hey: 'You are online ;) !',
  });
});

Route.post('/user/create', 'UsersController.store').validator([
  'EmailExistent',
  'PasswordConfirmation',
]);

Route.post('/session', 'SessionController.store').validator([
  'EmailForAuthentication',
]);

Route.post('/session/adm', 'SessionAdmController.store').validator([
  'EmailForAuthentication',
]);

Route.post('/forgot', 'ForgotPasswordController.store').validator([
  'EmailForAuthentication',
]);

Route.patch('/reset', 'ResetPasswordController.update').validator(
  'PasswordConfirmation'
);

Route.get('pets/:page?', 'PetController.index').middleware(['auth']);

Route.patch('/user/favorite/:id', 'FavoriteController.store').middleware([
  'auth',
]);

Route.get('/user/favorites/:page?', 'FavoriteController.show').middleware([
  'auth',
]);

Route.delete('/user/disfavor/:id', 'FavoriteController.destroy').middleware([
  'auth',
]);

Route.post('/pet', 'PetController.store').middleware(['auth:adminjwt']);

Route.post(
  '/user/adoption/request/',
  'AdoptionRequestController.store'
).middleware(['auth']);

Route.get('/adoption/requests/', 'AdoptionRequestController.index').middleware([
  'auth:adminjwt',
]);

Route.delete('/user', 'UsersController.delete').middleware(['auth']);
Route.patch('/user/avatar', 'UsersController.updateAvatar').middleware([
  'auth',
]);

Route.post('/session/social', 'SessionController.social');

Route.put('/user', 'UsersController.update')
  .validator(['UpdateUser'])
  .middleware(['auth']);

Route.get('/news/:page?', 'NewController.index').middleware(['auth']);

Route.post('/news', 'NewController.store').middleware(['auth:adminjwt']);
