import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Express } from 'express';
import * as compression from 'compression';

export function init(app: INestApplication, server: Express) {
  const config = app.get(ConfigService);

  const cors = config.get<string>('CORS');
  const gzip = config.get<string>('GZIP');
  const trustProxy = config.get<string>('TRUST_PROXY');
  app.use(helmet());

  if (cors) {
    app.enableCors({
      origin: cors,
    });
  }
  server.set('trust proxy', trustProxy ? trustProxy : false);
  if (gzip) {
    app.use(compression());
  }

  return app.init();
}
