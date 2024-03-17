import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 27027,
            username: 'postgres',
            password: '4321',
            database: 'coffees',
            autoLoadEntities: true,
            synchronize: true,
        }),
        CoffeesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
