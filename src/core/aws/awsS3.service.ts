import { Injectable } from '@nestjs/common';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; 
import { s3 } from './aws.config';
import { environments } from 'src/environments/environments';

@Injectable()
export class S3Service {
  private readonly bucketName = environments.aws.bucketName;

  async uploadFile(file): Promise<string> {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await s3.send(new PutObjectCommand(params));
      return `https://${this.bucketName}.s3.${environments.aws.awsRegion}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('File upload failed');
    }
  }

  async deleteFile(imageUrl: string): Promise<void> {
    const fileName = imageUrl.split('/').pop();
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    try {
      await s3.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('File deletion failed');
    }
  }
}
