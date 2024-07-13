import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FlavorsByCoffeeLoader } from './data-loader/flavors-by-coffee.loader';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Resolver(() => Coffee)
export class CoffeeFlavorsResolver {
    constructor(private readonly loader: FlavorsByCoffeeLoader) {}

    @ResolveField('flavors', () => [Flavor])
    async getFlavorsOfCoffees(@Parent() coffee: Coffee) {
        return this.loader.load(coffee.id);
    }
}
