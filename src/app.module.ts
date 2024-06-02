import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from './coffees/coffees.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import validationSchema from './config/validation-schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [ormConfig],
            expandVariables: true,
            envFilePath: process.env.NODE_ENV
                ? `.env.${process.env.NODE_ENV}`
                : '.env',
            validationSchema: validationSchema,
        }),
        TypeOrmModule.forRootAsync({
            useFactory:
                process.env.NODE_ENV !== 'production'
                    ? ormConfig
                    : ormConfigProd,
        }),
        CoffeesModule,
        CommonModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
