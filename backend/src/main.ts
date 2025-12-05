import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupDatabase } from './database/db-setup';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Initialize database (Drop & Create)
  // await setupDatabase();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(3000);
}
bootstrap();
