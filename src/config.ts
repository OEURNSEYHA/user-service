import dotenv from 'dotenv'
import path from 'path';
import * as yup from 'yup';

type Config = {
  env: string;
  port: number;
  mongodbUrl: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  s3BucketName: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || 'development';
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables using yup
  const envVarsSchema = yup.object().shape({
    NODE_ENV: yup.string().oneOf(['development', 'production', 'test']).default('development'),
    PORT: yup.number().default(3000),
    MONGODB_URL: yup.string().required(),
    AWS_ACCESS_KEY_ID: yup.string().required(),
    AWS_SECRET_ACCESS_KEY: yup.string().required(),
    AWS_REGION: yup.string().required(),
    AWS_S3_BUCKET_NAME: yup.string().required()
  }).required();

  // Validate the environment variables
  let envVars;
  try {
    envVars = envVarsSchema.validateSync(process.env, { stripUnknown: true });
  } catch (error) {
    throw new Error(`Config validation error: ${error}`);
  }

  return {

    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongodbUrl: envVars.MONGODB_URL,
    awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    awsRegion: envVars.AWS_REGION,
    s3BucketName: envVars.AWS_S3_BUCKET_NAME
  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;