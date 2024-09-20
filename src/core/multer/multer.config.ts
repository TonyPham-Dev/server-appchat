import { S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../aws/aws.config';
import { environments } from 'src/environments/environments';

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: environments.aws.bucketName, // Specify your S3 bucket name
    acl: 'public-read', // Adjust the ACL based on your requirements
    key: (req, file, cb) => {
      cb(null, `images/${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

export { upload };
