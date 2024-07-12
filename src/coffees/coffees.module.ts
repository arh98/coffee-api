import { Module } from '@nestjs/common';
import { CoffeesResolver } from './coffees.resolver';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { CoffeeFlavorsResolver } from './coffee-flavors.resolver';
import { DateScalar } from 'src/common/scalars/date.scalar';

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor])],
    providers: [
        CoffeesResolver,
        CoffeesService,
        CoffeeFlavorsResolver,
        DateScalar,
    ],
})
export class CoffeesModule {}
