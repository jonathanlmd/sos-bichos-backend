const { formatters } = use('Validator');

class CreateNew {
  get rules() {
    return {
      folder:
        'required|file|file_ext:png,jpg,jpeg|file_size:2mb|file_types:image',
    };
  }

  get messages() {
    return {
      'folder.required': 'Folder is required',
      'folder.file': 'Folder should be a file',
      'folder.file_ext': 'Folder should be png, jpg or jpeg',
      'folder.file_size': 'Folder should be max size of 2mb',
      'folder.file_types': 'Folder should be image',
    };
  }

  get formatter() {
    return formatters.JsonApi;
  }

  async fails(errorMessages) {
    return this.ctx.response.status(409).json(errorMessages);
  }
}

module.exports = CreateNew;
