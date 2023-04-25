import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

export type MainDataSourceOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;

  synchronize?: boolean;
};

export function mainDatabaseConnectionConfig(
  options: MainDataSourceOptions,
): TypeOrmModuleOptions & DataSourceOptions {
  return {
    type: 'mariadb',
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password,
    database: options.database,
    multipleStatements: true,
    autoLoadEntities: true,
    synchronize: !!options.synchronize,
    migrationsRun: false,
    charset: 'utf8mb4_unicode_ci',
    migrations: [path.join(__dirname, 'migrations/**/*.{ts,js}')],
    entities: [path.join(__dirname, 'entities/**/*.{ts,js}')],
    migrationsTableName: 'db_migrations',
  };
}

export function mainDatabaseConnectionConfigFromConfigService(
  configService: ConfigService,
): TypeOrmModuleOptions & DataSourceOptions {
  const dataSourceOptions = {
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    synchronize: configService.get<string>('DB_SYNC') === 'TRUE',
  };

  return mainDatabaseConnectionConfig(dataSourceOptions);
}
