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

Route.post('/user/create', 'UsersController.store');
Route.post('/session', 'SessionController.authenticate');
Route.post('/forgot', 'ForgotPasswordController.store');
Route.patch('/reset', 'ResetPasswordController.update').validator(
  'PasswordConfirmation'
);
