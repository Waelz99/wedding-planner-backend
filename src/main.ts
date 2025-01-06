import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app, 'api');

  const port = process.env.PORT;
  await app.listen(port);

  if (process.env.NODE_ENV !== 'production') {
    Logger.log(`Application is running on port http://localhost:${port}/`);
  }
}
bootstrap();
