/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const New = use('App/Models/New');

const StorageProvider = use('My/StorageProvider');

class NewController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async index({ request, response }) {
    const { page = 1 } = request.only(['page']);
    const newsPage = await New.query().paginate(page, 10);

    const formatPage = ({ data: news, ...pagination }) => {
      return { pagination, news };
    };

    return response.json(formatPage(newsPage.toJSON()));
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store({ request, response }) {
    const { data } = request.all();
    const { title, subtitle, body } = JSON.parse(data);

    const folderPic = request.file('folder', {
      types: ['image'],
      size: '2mb',
    });
    const fileName = await StorageProvider.saveFile(folderPic, 'news');

    const storagedNew = await New.create({
      title,
      subtitle,
      body,
      folder: fileName,
    });

    return response.json(storagedNew);
  }
}

module.exports = NewController;
