const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DiskStorage {
  constructor(Config) {
    this.uploadConfig = Config;
  }

  async saveFile(file, pathToStorage) {
    await file.move(`${this.uploadConfig.uploadsFolder}/${pathToStorage}`, {
      name: `${crypto.randomBytes(10).toString('HEX')}-${file.clientName}`,
      overwrite: true,
    });

    if (!file.moved()) {
      return file.errors();
    }
    return file.fileName;
  }

  async deleteFile(file) {
    const filePath = path.resolve(this.uploadConfig.uploadsFolder, file);
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
