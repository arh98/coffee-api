import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CoffeesModule } from './coffees/coffees.module';
import { CommonModule } from './common/common.module';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import validationSchema from './config/validation-schema';
import { UsersModule } from './users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

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
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
        CoffeesModule,
        CommonModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
