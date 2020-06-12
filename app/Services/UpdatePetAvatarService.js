class UpdatePetAvatarService {
  constructor({ StorageProvider, PetLucidModel }) {
    this.StorageProvider = StorageProvider;
    this.Pet = PetLucidModel;
  }

  async execute({ petId, avatar }) {
    const pet = await this.Pet.findBy('id', petId).first();

    if (pet.avatar) {
      await this.StorageProvider.deleteFile(pet.avatar);
    }

    const fileName = await this.StorageProvider.saveFile(avatar);

    pet.avatar = fileName;

    await pet.save();
  }
}

export default UpdatePetAvatarService;
