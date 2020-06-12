/** @typedef { import('@google-cloud/storage/build/src/storage')} Storage */
/** @typedef {import('@adonisjs/bodyparser/src/Multipart/File')} File */

const fs = require('fs');
const crypto = require('crypto');

/** @type {Storage} */
const { Storage } = require('@google-cloud/storage');

class GoogleCloudStorage {
  constructor(Config) {
    this.uploadConfig = Config;
  }

  /**
   *
   * @param {File} file
   */

  async saveFile(file, path) {
    try {
      console.log('OK aqui');

      const storage = new Storage({
        projectId: this.uploadConfig.projectId,
        region: this.uploadConfig.region,
        credentials: {
          client_email: this.uploadConfig.clientEmail,
          private_key: this.uploadConfig.privateKey,
        },
      });

      const name = `${path.endsWith('/') ? path : path}+'/'
    }${crypto.randomBytes(10).toString('HEX')}-${file.clientName}`;
      const [_, data] = await storage
        .bucket(this.uploadConfig.bucket)
        .upload(file.tmpPath, {
          destination: name,
          gzip: true,
          predefinedAcl: 'publicRead',
        });

      console.log(name);
      console.log(data);

      await fs.promises.unlink(file.tmpPath);

      return data.mediaLink;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteFile(file) {
    const storage = new Storage(this.uploadConfig);
    await storage.bucket(this.uploadConfig.bucket).file(file).delete();
  }
}

module.exports = GoogleCloudStorage;
