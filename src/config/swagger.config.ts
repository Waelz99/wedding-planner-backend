import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, path: string): void {
  const config = new DocumentBuilder()
    .setTitle('Wedding Planner API')
    .setDescription(
      'API documentation for the NestJS Wedding Planner application',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);

  Logger.log(`Swagger UI will be available at path: ${path}`);
}
