/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Pet = use('App/Models/Pet');

const StorageProvider = use('My/StorageProvider');

class PetController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const { page = 1 } = request.only(['page']);

    const formatPage = ({ data: pets, ...pagination }) => {
      return { pagination, pets };
    };

    const petsForPage = await Pet.query().paginate(page, 10);

    return response.json(formatPage(petsForPage.toJSON()));
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const { data } = request.all();
    const { name, sex, description, rescued_at } = JSON.parse(data);

    const profilePics = request.file('avatar', {
      types: ['image'],
      size: '2mb',
    });
    const fileName = await StorageProvider.saveFile(profilePics);

    const pet = await Pet.create({
      name,
      sex,
      description,
      rescued_at,
      avatar: fileName,
    });

    return response.json(pet);
  }
}

module.exports = PetController;
