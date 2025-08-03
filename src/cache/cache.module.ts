import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from '../redis/redis.module';
import { CacheInterceptor } from '../interceptors/cache.interceptor';

@Module({
  imports: [RedisModule],
  providers: [CacheService, CacheInterceptor],
  exports: [CacheService, CacheInterceptor],
})
export class CacheModule {}