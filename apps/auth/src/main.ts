import { NestFactory } from '@nestjs/core';
import { BackendAppModule } from './modules/application/backend-app.module';

async function bootstrap() {
  const app = await NestFactory.create(BackendAppModule);

  await app.listen(3000);
}
bootstrap();
