/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Pet = use('App/Models/Pet');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const AdoptionRequest = use('App/Models/AdoptionRequest');

class AdoptionRequestController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store({ request, response, auth }) {
    const { user_id, pet_id } = request.body;

    const pet = await Pet.findBy({ id: pet_id });

    if (!pet) {
      return response.status(400).json({
        status: 'error',
        message: 'Pet not found',
      });
    }

    const user = await auth.getUser();

    const adoptionRequest = await AdoptionRequest.create({
      id_user: user.id,
      id_pet: pet_id,
    });

    pet.adopted = true;
    await pet.save();

    return response.json({ id: adoptionRequest, user_id, pet_id });
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async index({ request, response, auth }) {
    const { page = 1 } = request.only(['page']);

    const admin = auth.authenticator('adminjwt').getUser();

    if (!admin) {
      return response.status(400).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    const formatPage = ({ data: adoption_requests, ...pagination }) => {
      return { pagination, adoption_requests };
    };

    const adoptionsRequests = await AdoptionRequest.query().paginate(page, 10);

    return response.json(formatPage(adoptionsRequests.toJSON()));
  }
}

module.exports = AdoptionRequestController;
