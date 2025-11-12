import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger('BlogAPI'),
  });
  const config = new DocumentBuilder()
    .setTitle('BlogApi')
    .setDescription('Api de um  blog')
    .setVersion('1.0')
    .addTag('blog')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'kepler',
    }),
  );
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  await app.listen(8000);
  logger.debug(`Server running on ${await app.getUrl()}`);
  logger.debug(`Documentation running on ${await app.getUrl()}/docs`);
}
bootstrap();
