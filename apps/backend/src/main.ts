import { QueryFilterPipe } from './../../shared/src/utils/query-expression/pipes/query-filter.pipe';
import { ValidationErrorFactory } from 'apps/shared/src/errors/validation-error-factory';
import { ApiExceptionFilter } from './../../shared/src/errors/api-exception.filter';
import { SanitizeDtoPipe } from './../../shared/src/utils/pipes/sanitize-dto.pipe';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BackendAppModule } from './modules/application/backend-app.module';
import { SwaggerDocs } from './modules/swagger/swagger-docs';

async function bootstrap() {
  const app = await NestFactory.create(BackendAppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(new QueryFilterPipe());

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
  console.log('Resource server started on PORT: ', appPort);
}
bootstrap();
