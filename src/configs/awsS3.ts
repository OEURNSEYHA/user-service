// import { S3Client } from '@aws-sdk/client-s3';
// import configs from '@/src/config';


// const s3Client = new S3Client({
//   region: configs.awsRegion,
//   credentials: {
//     accessKeyId: configs.awsAccessKeyId!,
//     secretAccessKey: configs.awsSecretAccessKey!,
//   },
// });

// export default s3Client;

import { S3Client } from '@aws-sdk/client-s3';
import configs from '@/src/config';

class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: configs.awsRegion,
      credentials: {
        accessKeyId: configs.awsAccessKeyId!,
        secretAccessKey: configs.awsSecretAccessKey!,
      },
    });
  }

  getClient(): S3Client {
    return this.client;
  }

  // Add any other S3-related methods here if needed
}

const s3Service = new S3Service();

export default s3Service;

