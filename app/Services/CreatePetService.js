class CreatePetService {
  constructor({ StorageProvider, PetLucidModel }) {
    this.StorageProvider = StorageProvider;
    this.Pet = PetLucidModel;
  }

  async execute({ name, sex, description, rescued_at, avatar }) {
    const fileName = await this.StorageProvider.saveFile(avatar);

    const pet = await this.Pet.create({
      name,
      sex,
      description,
      rescued_at,
      avatar: fileName,
    });

    return pet;
  }
}

module.exports = CreatePetService;
