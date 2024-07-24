import { S3Client } from '@aws-sdk/client-s3';
import configs from '@/src/config';


const s3Client = new S3Client({
  region: configs.awsRegion,
  credentials: {
    accessKeyId: configs.awsAccessKeyId!,
    secretAccessKey: configs.awsSecretAccessKey!,
  },
});

export default s3Client;
