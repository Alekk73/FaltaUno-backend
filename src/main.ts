import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';
import { SwaggerConfigModule } from './common/swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  // Valida que se cumplan las restricciones de los DTO
  app.useGlobalPipes(new ValidationPipe());

  // Activa el @Exclude() de class-transformer para no mostrar determinados datos
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // Configuracion Swagger
  SwaggerConfigModule.setupSwagger(app, configService);

  const port = +configService.get('PORT');
  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}/api`);
}
bootstrap();
