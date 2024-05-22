// import * as dotenv from 'dotenv';
// dotenv.config();
import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 27027,
    username: 'postgres',
    password: '4321',
    database: 'coffees',
    synchronize: false,
    dropSchema: false,
    logging: false,
    logger: 'file',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    migrationsTableName: 'migration_table',
});

// for previous versions : 0.2.* - orm.config.js

// module.exports = {
//     type: 'postgres',
//     host: 'localhost',
//     port: 27027,
//     username: 'postgres',
//     password: '4321',
//     database: 'coffees',
//     entities: ['dist/**/*.entity.js'],
//     migrations: ['dist/migrations/*.js'],
//     cli: {
//         migrationsDir: 'src/migrations',
//     },
// };
