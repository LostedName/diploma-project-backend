import { INestApplication } from '@nestjs/common';
import { AppEnvironment } from '../../../../shared/src/env/app-environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BackendAppModule } from '../application/backend-app.module';

export class SwaggerDocs {
  static setup(app: INestApplication) {
    if (process.env.NODE_ENV == AppEnvironment.Prod) {
      return;
    }

    const tasksConfig = new DocumentBuilder()
      .setTitle('Note Api')
      .setDescription('API documentation')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();

    const apiDocument = SwaggerModule.createDocument(app, tasksConfig, {
      include: [BackendAppModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('/api/docs', app, apiDocument);
  }
}
