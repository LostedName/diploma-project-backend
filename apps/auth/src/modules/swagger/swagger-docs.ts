import { INestApplication } from '@nestjs/common';
import { AppEnvironment } from '../../../../shared/src/env/app-environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BackendAuthAppModule } from '../application/backend-auth-app.module';

export class SwaggerDocs {
  static setup(app: INestApplication) {
    if (process.env.NODE_ENV == AppEnvironment.Prod) {
      return;
    }

    const tasksConfig = new DocumentBuilder()
      .setTitle('Authorization Server Api')
      .setDescription('API documentation')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();

    const apiDocument = SwaggerModule.createDocument(app, tasksConfig, {
      include: [BackendAuthAppModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('/api/docs', app, apiDocument);
  }
}
