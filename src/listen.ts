import { Express } from 'express';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { readFileSync } from 'node:fs';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function listen(app: INestApplication, server: Express) {
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 80);
  const host = config.get<string>('HOST', 'localhost');

  const httpsOnly = config.get<number>('HTTPS_ONLY');
  const tslPort = config.get<number>('HTTPS_PORT', 443);
  const key_path = config.get<string>('KEY');
  const cert_path = config.get<string>('CERT');
  if (!httpsOnly) {
    createHttpServer(server).listen(port, host, () => {
      Logger.verbose(`Listening at http://${host}:${port}`);
    });
  }
  if (key_path && cert_path) {
    const httpsOptions = {
      key: readFileSync(key_path),
      cert: readFileSync(cert_path),
    };
    createHttpsServer(httpsOptions, server).listen(tslPort, host, () => {
      Logger.verbose(`Listening at https://${host}:${tslPort}`);
    });
  }
}
