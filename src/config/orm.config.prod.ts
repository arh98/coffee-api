import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'mssql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: false,
        dropSchema: false,
    }),
);
