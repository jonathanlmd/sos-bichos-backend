/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Pet = use('App/Models/Pet');

class PetController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const { indexPage = 1 } = request.only(['page']);

    const formatPage = ({ data: pets, ...pagination }) => {
      return { pagination, pets };
    };

    const page = await Pet.query().paginate(indexPage, 10);

    return response.json(formatPage(page.toJSON()));
  }
}

module.exports = PetController;
