import { ImageRepositories } from "../database/repositories/image.repository";


export class ImageService {
  private imageRepository: ImageRepositories;
  constructor() {
    this.imageRepository = new ImageRepositories();
  }

  public async uploadFile(file: Express.Multer.File) {
    return await this.imageRepository.uploadFile(file)
  }

  public async getUploadFile() {
    return await this.imageRepository.getUploadFile();
  }

}