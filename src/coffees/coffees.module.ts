import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { EventEntity } from './../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees-constants';
import { ConfigModule } from '@nestjs/config';

class CustomService {}

class Strategy {}
class StrategyOne {}
class StrategyTwo {}

export class CoffeeBrandFactory {
    // do something
    create() {
        return ['nescafe', 'buddy brew'];
    }
}

@Module({
    imports: [
        TypeOrmModule.forFeature([Coffee, Flavor, EventEntity]),
        ConfigModule,
    ],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        // 1- value providers :
        { provide: COFFEE_BRANDS, useValue: ['nescafe', 'buddy brew'] },
        { provide: CustomService, useValue: new CustomService() },

        // 2-class providers :
        {
            provide: Strategy,
            useClass:
                process.env.NODE_ENV === 'production'
                    ? StrategyOne
                    : StrategyTwo,
        },
        // 3-factory providers :
        // {
        //     provide: CoffeeBrandFactory,
        //     useFactory: (bf: CoffeeBrandFactory) => bf.create(),
        //     inject: [CoffeeBrandFactory],
        // },
        {
            provide: COFFEE_BRANDS,
            useFactory: async () => {
                // const brands = await ds.query('SELECT * ...');
                const barnds = await Promise.resolve(['nescafe', 'buddy brew']);
                return barnds;
            },
        },
    ],
    // providers are encapsulated by default , to use them : import module + export here
    exports: [CoffeesService],
})
export class CoffeesModule {}
