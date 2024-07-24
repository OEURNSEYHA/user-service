// import { Post, Route, UploadedFiles, UploadedFile } from 'tsoa';
// // import { Request, Response } from 'express';
// import { uploadFileToS3 } from '../services/image.service'; // Ensure this is correctly implemented
// import Image from '../database/models/image.model'; // Ensure the path is correct

// @Route('files')
// export class FilesController {
//   @Post('uploadSingle')
//   public async uploadFile(

//     @UploadedFile() file: Express.Multer.File,
//   ): Promise<{ message: string, imageUrl: string }> {
//     // console.log('Single file:', file);

//     try {
//       // Upload file to S3 and get the URL
//       const imageUrl = await uploadFileToS3(file);

//       // Save URL to MongoDB
//       const image = new Image({ url: imageUrl });
//       await image.save();

//       return { message: 'File uploaded successfully', imageUrl };
//     } catch (error) {
//       throw new Error('Error uploading file: ' + error);
//     }
//   }

//   @Post('uploadMultiple')
//   public async uploadFiles(

//     @UploadedFiles() files: Express.Multer.File[],
//   ): Promise<{ message: string, imageUrls: string[] }> {
//     // console.log('Multiple files:', files);

//     try {
//       const imageUrls = await Promise.all(files.map(async (file) => {
//         // Upload each file to S3 and get the URL
//         const imageUrl = await uploadFileToS3(file);

//         // Save each URL to MongoDB
//         const image = new Image({ url: imageUrl });
//         await image.save();

//         return imageUrl;
//       }));

//       return { message: 'Files uploaded successfully', imageUrls };
//     } catch (error) {
//       throw new Error('Error uploading files: ' + error);
//     }
//   }
// }




import { Post, Route, UploadedFiles, UploadedFile, Tags, Controller, Get, Delete, SuccessResponse } from 'tsoa';

import { uploadFileToS3, deleteFileFromS3 } from '@/src/middlewares/upload'; // Ensure this is correctly implemented
import Image from '../database/models/image.model'; // Ensure the path is correct
import { ImageService } from '../services/image.service';

export interface uploadImage { message: string, imageUrl: string }


@Tags('uploadImage')
@Route('files')
export class FilesController extends Controller {

  private imagService: ImageService;
  constructor() {
    super();
    this.imagService = new ImageService();
  }
  @Post('uploadSingle')
  public async uploadFile(

    @UploadedFile() file: Express.Multer.File,
  ): Promise<uploadImage> {
    console.log('Single file:', file);

    try {

      return await this.imagService.uploadFile(file)
      // if (!file) {
      //   throw new Error('No file uploaded');
      // }

      // // Upload file to S3 and get the URL
      // const imageUrl = await uploadFileToS3(file);

      // // Save URL to MongoDB
      // const image = new Image({ url: imageUrl });
      // await image.save();

      // return { message: 'File uploaded successfully', imageUrl };
    } catch (error) {
      console.error('Error uploading single file:', error);
      throw new Error('Error uploading file: ' + error);
    }
  }
  @Get("files")

  public async getUploadFiles(): Promise<uploadImage> {
    try {
      const imageUrl = await this.imagService.getUploadFile();
      return { message: "success",  imageUrl }
    } catch (error) {
      throw error
    }
  }


  @Post('uploadMultiple')
  public async uploadFiles(

    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ message: string, imageUrls: string[] }> {
    console.log('Multiple files:', files);

    
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }

      const imageUrls = await Promise.all(files.map(async (file) => {
        // Upload each file to S3 and get the URL
        const imageUrl = await uploadFileToS3(file);

        // Save each URL to MongoDB
        const image = new Image({ url: imageUrl });
        await image.save();

        return imageUrl;
      }));

      return { message: 'Files uploaded successfully', imageUrls };
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw new Error('Error uploading files: ' + error);
    }
  }


  @Delete('delete/{id}')
  @SuccessResponse('200', 'Deleted')
  public async deleteFile(id: string): Promise<{ message: string }> {
    try {
      // Find the image document by ID
      const image = await Image.findById(id);
      if (!image) {
        throw new Error('Image not found');
      }

      // Extract the file key from the image URL
      const urlParts = image.url.split('/');
      const fileKey = urlParts[urlParts.length - 1];


      

      // Delete the file from S3
      await deleteFileFromS3(fileKey);

      // Delete the document from MongoDB
      await Image.findByIdAndDelete(id);

      return { message: 'File deleted successfully' };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
