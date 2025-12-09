import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

void ConfigModule.forRoot({});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  database: configService.get('DB_NAME'),
  password: String(configService.get('DB_PASS')),
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  migrationsTableName: 'migraciones',
};

export const AppDS = new DataSource(DataSourceConfig);
