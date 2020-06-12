class UpdateUserAvatarService {
  constructor({ StorageProvider, UserLucidModel }) {
    this.StorageProvider = StorageProvider;
    this.User = UserLucidModel;
  }

  async execute({ userId, avatar }) {
    const user = await this.User.findBy('id', userId).first();

    if (user.avatar) {
      await this.StorageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.StorageProvider.saveFile(avatar);

    user.avatar = fileName;

    await user.save();
  }
}

export default UpdateUserAvatarService;
