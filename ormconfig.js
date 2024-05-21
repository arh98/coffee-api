// for version 0.2.*
module.exports = {
    type: 'postgres',
    host: 'localhost',
    port: 27027,
    username: 'postgres',
    password: '4321',
    database: 'coffees',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};
