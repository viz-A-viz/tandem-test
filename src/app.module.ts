import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { RedisModule } from './redis/redis.module';
import { Post } from './post/entities/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [Post],
        migrations: ['dist/src/database/migrations/*.js'],
        migrationsTableName: 'typeorm_migrations',
        synchronize: false,
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    PostModule,
  ],
})
export class AppModule {}