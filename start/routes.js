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

Route.post('/user/create', 'UsersController.store').validator([
  'Email',
  'PasswordConfirmation',
]);

Route.post('/session', 'SessionController.store').validator(['Email']);

Route.post('/forgot', 'ForgotPasswordController.store').validator(['Email']);

Route.patch('/reset', 'ResetPasswordController.update').validator(
  'PasswordConfirmation'
);

Route.get('pets/:page?', 'PetController.index').middleware(['auth']);
