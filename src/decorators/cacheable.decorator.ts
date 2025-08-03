import { SetMetadata } from '@nestjs/common';

export const CACHEABLE_KEY = 'cacheable';

export interface CacheableOptions {
  prefix: string;
  paramsForKey?: string[];
  ttl?: number;
}

export const Cacheable = (options: CacheableOptions) =>
  SetMetadata(CACHEABLE_KEY, options);