const { ServiceProvider } = require('@adonisjs/fold');

const DiskStorage = require('./implementations/DiskStorage');
const GoogleCloudStorage = require('./implementations/GoogleCloudStorage');

class StorageProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton('My/StorageProvider', () => {
      const config = this.app.use('Adonis/Src/Config').get('drive');
      const { disks, default: defaultDrive } = config;
      let Drive;

      switch (defaultDrive) {
        case 'gcs':
          Drive = new GoogleCloudStorage(disks[defaultDrive]);
          break;
        case 'local':
          Drive = new DiskStorage(disks[defaultDrive]);
          break;
        default:
          Drive = new DiskStorage(disks.local);
          break;
      }
      return Drive;
    });
  }
}

module.exports = StorageProvider;
