import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts as PostsDocument } from '../schema/posts.schema'; 
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Posts } from '../schema/posts.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(PostsDocument.name) private postModel: Model<PostsDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<Posts> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async findAll(): Promise<Posts[]> {
    return this.postModel.find().exec();
  }

  async findById(id: string): Promise<Posts> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Posts> {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
      runValidators: true,
    });
    
    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }

    return updatedPost;
  }

  async delete(id: string): Promise<void> {
    const result = await this.postModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Post not found');
    }
  }
}
