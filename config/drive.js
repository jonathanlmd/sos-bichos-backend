const Helpers = use('Helpers');
const Env = use('Env');

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default disk
  |--------------------------------------------------------------------------
  |
  | The default disk is used when you interact with the file system without
  | defining a disk name
  |
  */
  default: Env.get('STORAGE_DRIVER') || 'local',

  disks: {
    /*
    |--------------------------------------------------------------------------
    | Local
    |--------------------------------------------------------------------------
    |
    | Local disk interacts with the a local folder inside your application
    |
    */
    local: {
      driver: 'local',
      tmpFolder: Helpers.tmpPath(),
      uploadsFolder: Helpers.tmpPath('uploads'),
    },

    /*
    |--------------------------------------------------------------------------
    | S3
    |--------------------------------------------------------------------------
    |
    | S3 disk interacts with a bucket on aws s3
    |
    */
    s3: {
      driver: 's3',
      key: Env.get('S3_KEY'),
      secret: Env.get('S3_SECRET'),
      bucket: Env.get('S3_BUCKET'),
      region: Env.get('S3_REGION'),
    },

    /*
    |--------------------------------------------------------------------------
    | GPC
    |--------------------------------------------------------------------------
    |
    | GPC disk interacts with a bucket on Google Storage
    |
    */

    gcs: {
      privateKey: Env.get('GCS_PRIVATE_KEY'),
      clientEmail: Env.get('GCS_CLIENT_EMAIL'),
      projectId: Env.get('GCS_PROJECT_ID'),
      bucket: Env.get('GCS_BUCKET'),
      region: Env.get('GCS_REGION'),
    },
  },
};
