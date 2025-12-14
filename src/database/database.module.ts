import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USER'),
        host: config.get<string>('DB_HOST'),
        password: config.get<string>('DB_PASS'),
        port: config.get<number>('DB_PORT'),
        entities: [__dirname + '/../modules/**/**/*.entity.{ts,js}'],
      }),
    }),
  ],
})
export class DatabaseModule {}
