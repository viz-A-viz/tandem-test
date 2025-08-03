import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';
import { CACHEABLE_KEY, CacheableOptions } from '../decorators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private cacheService: CacheService,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = this.reflector.get<CacheableOptions>(
      CACHEABLE_KEY,
      context.getHandler(),
    );

    if (!options) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const key = this.generateKey(options, request);

    const cachedResult = await this.cacheService.get(key);
    if (cachedResult) {
      return of(cachedResult);
    }

    return next.handle().pipe(
      tap(async (result) => {
        await this.cacheService.set(key, result, options.ttl);
      }),
    );
  }

  private generateKey(options: CacheableOptions, request: any): string {
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