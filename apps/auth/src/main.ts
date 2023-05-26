import { QueryFilterPipe } from './../../shared/src/utils/query-expression/pipes/query-filter.pipe';
import { ApiExceptionFilter } from './../../shared/src/errors/api-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SanitizeDtoPipe } from './../../shared/src/utils/pipes/sanitize-dto.pipe';
import { BackendAuthAppModule } from './modules/application/backend-auth-app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerDocs } from './modules/swagger/swagger-docs';
import { ValidationErrorFactory } from 'apps/shared/src/errors/validation-error-factory';

async function bootstrap() {
  const authApp = await NestFactory.create(BackendAuthAppModule);
  authApp.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  authApp.useGlobalPipes(new QueryFilterPipe());

  authApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: ValidationErrorFactory,
    }),
  );
  authApp.useGlobalPipes(new SanitizeDtoPipe());

  authApp.useGlobalFilters(new ApiExceptionFilter());

  // Documentation
  SwaggerDocs.setup(authApp);

  const authAppPort = process.env.BACKEND_AUTH_PORT || 3001;

  await authApp.listen(authAppPort);
  console.log('Authorization server started on PORT: ', authAppPort);
}
bootstrap();
