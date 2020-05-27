/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Pet = use('App/Models/Pet');

/** @type{import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers');

const crypto = require('crypto');

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

  async store({ request, response }) {
    const { data } = request.all();
    const { name, sex, description, rescued_at } = JSON.parse(data);

    const profilePics = request.file('avatar', {
      types: ['image'],
      size: '2mb',
    });

    await profilePics.move(Helpers.tmpPath('uploads'), {
      name: `${crypto.randomBytes(10).toString('HEX')}-${
        profilePics.clientName
      }`,
      overwrite: true,
    });

    if (!profilePics.moved()) {
      return profilePics.errors();
    }

    const pet = await Pet.create({
      name,
      sex,
      description,
      rescued_at,
      avatar: profilePics.fileName,
    });

    return response.json(pet);
  }
}

module.exports = PetController;
