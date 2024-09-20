import { S3 } from '@aws-sdk/client-s3';
import { environments } from 'src/environments/environments';

const s3 = new S3({
  region: environments.aws.awsRegion,
  credentials: {
    accessKeyId: environments.aws.accessKeyId,
    secretAccessKey: environments.aws.secretAccessKey,
  },
});

export { s3 };
