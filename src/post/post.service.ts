import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    const savedPost = await this.postRepository.save(post);

    return savedPost;
  }

  async findAll(paginationDto: PaginationDto): Promise<Post[]> {
    const { page, step } = paginationDto;
    const skip = (page - 1) * step;
    return this.postRepository.find({
      skip: skip,
      take: step,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    
    Object.assign(post, updatePostDto);
    const updatedPost = await this.postRepository.save(post);

    return updatedPost;
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    
    await this.postRepository.remove(post);
  }
}