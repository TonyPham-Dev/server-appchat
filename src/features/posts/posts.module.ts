import { Module } from '@nestjs/common';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Posts, PostsSchema } from './schema/posts.schema';
import { S3Service } from 'src/core/aws/awsS3.service';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Posts.name,
        schema: PostsSchema,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, S3Service],
  exports: [PostsService, S3Service]

})
export class PostsModule {}
