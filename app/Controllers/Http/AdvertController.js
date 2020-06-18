/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Advert = use('App/Models/Advert');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Pet = use('App/Models/Pet');

class AdvertController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store({ response, auth, params }) {
    const { petId } = params;

    const pet = await Pet.findBy('id', petId);
    if (!pet) {
      return response.status(400).json({
        status: 'error',
        message: 'Pet not found',
      });
    }

    const user = await auth.getUser();

    const advert = await Advert.query()
      .where({ id_pet: petId, id_user: user.id })
      .first();

    if (advert) {
      advert.times += 1;
      await advert.save();
    } else {
      await user.savedPets().attach(petId);
    }
    await user.reload();
    const adverts = await Advert.query().where({ id_user: user.id }).fetch();

    const adsSeen = adverts.rows.reduce((count, advertItem) => {
      return advertItem.times + count;
    }, 0);

    return response.json({
      totalPetsHelpeds: adverts.rows.length,
      adsSeen,
    });
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async show({ response, auth }) {
    const user = await auth.getUser();
    const adverts = await Advert.query().where({ id_user: user.id }).fetch();

    const adsSeen = adverts.rows.reduce((count, advertItem) => {
      return advertItem.times + count;
    }, 0);

    return response.json({
      totalPetsHelpeds: adverts.rows.length,
      adsSeen,
    });
  }
}

module.exports = AdvertController;
