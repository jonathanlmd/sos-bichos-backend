/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Pet = use('App/Models/Pet');

const StorageProvider = use('My/StorageProvider');

class PetController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, auth }) {
    const { page = 1 } = request.only(['page']);
    const user = await auth.getUser();
    let favoritedPets = await user.favoritePets().select('id').fetch();
    favoritedPets = favoritedPets.toJSON();

    const formatPage = ({ data: pets, ...pagination }) => {
      return { pagination, pets };
    };

    const petsForPage = await Pet.query()
      .where('adopted', false)
      .paginate(page, 10);

    petsForPage.rows.forEach(pet => {
      Object.assign(pet, {
        favorited: !!favoritedPets.find(favorited => favorited.id === pet.id),
      });
    });

    return response.json(formatPage(petsForPage.toJSON()));
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
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
    const fileName = await StorageProvider.saveFile(profilePics, 'pets');

    const pet = await Pet.create({
      name,
      sex,
      description,
      rescued_at,
      avatar: fileName,
    });

    return response.json(pet);
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, auth }) {
    //
  }
}

module.exports = PetController;
