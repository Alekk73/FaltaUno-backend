import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  // Valida que se cumplan las restricciones de los DTO
  app.useGlobalPipes(new ValidationPipe());

  // Activa el @Exclude() de class-transformer para no mostrar determinados datos
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = +configService.get('PORT');
  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}/api`);
}
bootstrap();
