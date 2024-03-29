/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Pet = use('App/Models/Pet');

class FavoriteController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ response, auth, params }) {
    const { id: petId } = params;

    const pet = await Pet.findBy('id', petId);

    if (!pet) {
      return response.status(400).json({
        status: 'error',
        message: 'Pet not found',
      });
    }

    const user = await auth.getUser();

    await user.favoritePets().attach(petId);

    return response.json(pet.toJSON());
  }

  async show({ response, auth }) {
    const user = await auth.getUser();

    const pets = await user.favoritePets().fetch();

    return response.json(pets.toJSON());
  }

  async destroy({ response, auth, params }) {
    const { id: petId } = params;

    const user = await auth.getUser();

    const pet = await Pet.findBy('id', petId);

    if (!pet) {
      return response.status(400).json({
        status: 'error',
        message: 'Pet not found',
      });
    }

    await user.favoritePets().detach([pet.id]);

    return response.status(204).send();
  }
}

module.exports = FavoriteController;
