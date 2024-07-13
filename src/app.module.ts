import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { CoffeesModule } from './coffees/coffees.module';
import { DrinksResolver } from './drinks/drinks.resolver';
import { Tea } from './teas/entities/tea.entity';
import { PubSubModule } from './pub-sub/pub-sub.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '4321',
            database: 'coffeesgql',
            autoLoadEntities: true,
            synchronize: true,
            logging: ['query'],
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            buildSchemaOptions: {
                orphanedTypes: [Tea],
            },
            installSubscriptionHandlers: true,
        }),
        CoffeesModule,
        PubSubModule,
    ],
    controllers: [AppController],
    providers: [DrinksResolver],
})
export class AppModule {}
