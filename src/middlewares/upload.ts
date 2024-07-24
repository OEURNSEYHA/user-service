import multer from 'multer';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/src/configs/awsS3'; // Ensure the path is correct
const storage = multer.memoryStorage();
export  const upload = multer({ storage });

export const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
    try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
} catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Error uploading file to S3: ' + error);
  }
};

export const deleteFileFromS3 = async (key: string): Promise<void> => {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('Bucket name is not defined in environment variables');
    }

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`File deleted successfully from S3: ${key}`);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Error deleting file from S3: ' + error);
  }
};




// import { PutObjectCommand } from '@aws-sdk/client-s3';
// import s3Client from '@/src/configs/awsS3';

// export const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET_NAME!,
//     Key: `${Date.now()}-${file.originalname}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const command = new PutObjectCommand(params);
//   await s3Client.send(command);

//   return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
// };