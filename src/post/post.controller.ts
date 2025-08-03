import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PostService } from './post.service';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PostResponseDto } from './dto/post-response.dto';

import { Cacheable } from "../decorators";
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { CacheInvalidate } from "../decorators/cacheInvalidate.decorator";
import { CacheInvalidateInterceptor } from "../interceptors/cacheInvalidate.interceptor";

@ApiTags('posts')
@Controller('posts')
@UseInterceptors(CacheInterceptor, CacheInvalidateInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @CacheInvalidate({ pattern: 'posts:*' })
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully', type: PostResponseDto })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @Cacheable({ prefix: 'posts', ttl: 300, paramsForKey: ['page', 'step'] })
  @ApiOperation({ summary: 'Get paginated posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully', type: [PostResponseDto] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postService.findAll(paginationDto);
  }

  @Get(':id')
  @Cacheable({ prefix: 'post', ttl: 300, paramsForKey: ['id'] })
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Post found', type: PostResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @CacheInvalidate({ pattern: 'posts:*', prefix: 'post', paramsForKey: ['id'] })
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully', type: PostResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @CacheInvalidate({ pattern: 'posts:*', prefix: 'post', paramsForKey: ['id'] })
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}