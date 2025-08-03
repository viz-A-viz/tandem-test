import { SetMetadata } from '@nestjs/common';

export const CACHE_INVALIDATE_KEY = 'cacheInvalidate';

export interface CacheInvalidateOptions {
  prefix?: string;
  paramsForKey?: string[];
  pattern?: string;
}

export const CacheInvalidate = (options: CacheInvalidateOptions) =>
  SetMetadata(CACHE_INVALIDATE_KEY, options);