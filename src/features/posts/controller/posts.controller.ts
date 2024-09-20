import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from '../service/posts.service';
import { S3Service } from 'src/core/aws/awsS3.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { UpdatePostDto } from '../dto/update-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  async findAll() {
    return this.postService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file,
  ) {
    const imageUrl = await this.s3Service.uploadFile(file);
    createPostDto.imageUrl = imageUrl;
    return this.postService.create(createPostDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file,
  ) {
    if (file) {
      const post = await this.postService.findById(id);
      if (post.imageUrl) {
        await this.s3Service.deleteFile(post.imageUrl);
      }
      const newImageUrl = await this.s3Service.uploadFile(file);
      updatePostDto.imageUrl = newImageUrl;
    }

    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const post = await this.postService.findById(id);
    if (post.imageUrl) {
      await this.s3Service.deleteFile(post.imageUrl);
    }

    return this.postService.delete(id);
  }
}
