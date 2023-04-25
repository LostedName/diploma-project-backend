import { SanitizeDtoPipe } from './../../shared/src/utils/pipes/sanitize-dto.pipe';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BackendAppModule } from './modules/application/backend-app.module';
import { ApiExceptionFilter } from './errors/api-exception.filter';
import { ValidationErrorFactory } from './errors/validation-error-factory';
import { SwaggerDocs } from './modules/swagger/swagger-docs';

async function bootstrap() {
  const app = await NestFactory.create(BackendAppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: ValidationErrorFactory,
    }),
  );
  app.useGlobalPipes(new SanitizeDtoPipe());

  app.useGlobalFilters(new ApiExceptionFilter());

  // Documentation
  SwaggerDocs.setup(app);

  const appPort = process.env.BACKEND_PORT || 3000;

  await app.listen(appPort);
}
bootstrap();
