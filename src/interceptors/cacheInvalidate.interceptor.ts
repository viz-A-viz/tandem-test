import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CacheService } from '../cache/cache.service';
import { CACHE_INVALIDATE_KEY, CacheInvalidateOptions } from "../decorators/cacheInvalidate.decorator";

@Injectable()
export class CacheInvalidateInterceptor implements NestInterceptor {
  constructor(
    private cacheService: CacheService,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = this.reflector.get<CacheInvalidateOptions>(
      CACHE_INVALIDATE_KEY,
      context.getHandler(),
    );

    if (!options) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const key = this.generateKey(options, request);

    await this.cacheService.delete(key);
    if (options.pattern) {
      await this.cacheService.invalidatePattern(options.pattern);
    }

    return next.handle();
  }

  private generateKey(options: CacheInvalidateOptions, request: any): string {
    if (!options.paramsForKey) {
      return options.prefix;
    }

    const allParams = {
      ...request.params,
      ...request.query,
      ...request.body,
    }
    const keyParts = [];

    for (const param of options.paramsForKey) {
      const value = allParams[param];
      if (value) {
        keyParts.push(value);
      } else {
        throw new Error(`Missing required parameter for cache key: ${param}`);
      }
    }

    return `${options.prefix}:${keyParts.join(':')}`;
  }
}