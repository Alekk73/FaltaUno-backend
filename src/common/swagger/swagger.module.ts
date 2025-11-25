import { INestApplication, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Express } from 'express';
import expressBasicAuth from 'express-basic-auth';

@Module({})
export class SwaggerConfigModule {
  static setupSwagger(
    app: INestApplication,
    configService: ConfigService,
  ): void {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('Documentación de la API')
      .setVersion('1.0')
      .build();

    const username: string = configService.get('SWAGGER_USER') as string;
    const password: string = configService.get('SWAGGER_PASSWORD') as string;

    app.use(
      '/docs',
      expressBasicAuth({
        challenge: true,
        users: {
          [username]: password,
        },
      }),
    );

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
}
