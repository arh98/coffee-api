import { Query, Resolver } from '@nestjs/graphql';
import { Coffee } from 'src/coffees/entities/coffee.entity';
import { DrinkResultUnoin } from 'src/common/unoins/drink-result.union';
import { Tea } from 'src/teas/entities/tea.entity';

@Resolver()
export class DrinksResolver {
    @Query(() => [DrinkResultUnoin], { name: 'drinks' })
    async findAll() {
        const coffee = new Coffee();
        coffee.id = 1;
        coffee.name = 'Cappuccino';
        coffee.brand = 'Starbucks';

        const tea = new Tea();
        tea.name = 'lipton';

        return [tea, coffee];
    }
}
