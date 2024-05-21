import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from './coffees/coffees.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        // ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            database: 'coffees',
            host: 'localhost',
            port: 27027,
            username: 'postgres',
            password: '4321',
            // database: process.env.DATABASE_NAME,
            // host: process.env.DATABASE_HOST,
            // port: +process.env.DATABASE_PORT,
            // username: process.env.DATABASE_USERNAME,
            // password: process.env.DATABASE_PASSWORD,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV === 'production' ? false : true,
        }),
        CoffeesModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
