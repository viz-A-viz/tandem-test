import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Post } from '../post/entities/post.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') || 'localhost',
  port: parseInt(configService.get('DATABASE_PORT')) || 5432,
  username: configService.get('DATABASE_USERNAME') || 'postgres',
  password: configService.get('DATABASE_PASSWORD') || 'postgres',
  database: configService.get('DATABASE_NAME') || 'blog_db',
  entities: [Post],
  migrations: ['dist/src/database/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: true,
  logging: false,
});