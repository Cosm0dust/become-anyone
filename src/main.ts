import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10, overrideSendResponse: false }),
  );

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(configService.get('PORT'));
}

bootstrap();

