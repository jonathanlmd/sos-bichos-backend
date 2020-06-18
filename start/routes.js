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

Route.group(() => {
  Route.get('/user/favorites/:page?', 'FavoriteController.show');
  Route.get('/user/ads', 'AdvertController.show');

  Route.post('/user/adoption/request/', 'AdoptionRequestController.store');
  Route.post('/user/ads/:petId', 'AdvertController.store');

  Route.put('/user', 'UsersController.update').validator(['UpdateUser']);

  Route.patch('/user/avatar', 'UsersController.updateAvatar');
  Route.patch('/user/favorite/:id', 'FavoriteController.store');

  Route.delete('/user/disfavor/:id', 'FavoriteController.destroy');
  Route.delete('/user/', 'UsersController.delete');

  Route.get('/pets/:page?', 'PetController.index');
  Route.get('/news/:page?', 'NewController.index');
}).middleware(['auth']);

Route.post('/user/create', 'UsersController.store').validator('CreateUser');
Route.post('/session/social', 'SessionController.social');
Route.post('/session', 'SessionController.store');
Route.post('/session/adm', 'SessionAdmController.store').validator([
  'EmailForAuthentication',
]);
Route.post('/forgot', 'ForgotPasswordController.store').validator([
  'EmailForAuthentication',
]);
Route.patch('/reset', 'ResetPasswordController.update').validator(
  'PasswordConfirmation'
);

Route.group(() => {
  Route.post('/news', 'NewController.store').validator(['CreateNew']);
  Route.get('/adoption/requests/', 'AdoptionRequestController.index');
  Route.post('/pet', 'PetController.store');
}).middleware(['auth:adminjwt']);
