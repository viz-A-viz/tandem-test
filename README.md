## Запуск через Docker Compose

```bash
docker-compose up -d
```

## Локальная разработка

```bash
docker-compose -f docker-compose.dev.yml up -d
npm i
npm run start:dev
```

## API Документация

После запуска приложения Swagger документация доступна по адресу:
**http://localhost:3000/docs**

## Конфигурация

Настройки находятся в файле `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=blog_db

REDIS_HOST=localhost
REDIS_PORT=6379
```
