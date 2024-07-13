import { CoffeesService } from './coffees.service';
import {
    Args,
    ID,
    Mutation,
    Query,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
import { Coffee } from './entities/coffee.entity';
import { ParseIntPipe } from '@nestjs/common';
import { CreateCoffeeInput } from './dto/create-coffee.input';
import { UpdateCoffeeInput } from './dto/update-coffee.input';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
export class CoffeesResolver {
    constructor(
        private readonly service: CoffeesService,
        private readonly pubSub: PubSub,
    ) {}

    @Query(() => [Coffee], { name: 'coffees' })
    async findAll() {
        return this.service.findAll();
    }

    @Query(() => Coffee, { name: 'coffee' })
    async findOne(@Args('id', { type: () => ID }, ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Mutation(() => Coffee, { name: 'createCoffee' })
    async create(@Args('createCoffeeInput') input: CreateCoffeeInput) {
        return this.service.create(input);
    }

    @Mutation(() => Coffee, { name: 'updateCoffee' })
    async update(
        @Args('updateCoffeeInput') input: UpdateCoffeeInput,
        @Args('id', ParseIntPipe) id: number,
    ) {
        return this.service.update(id, input);
    }

    @Mutation(() => Coffee, { name: 'deleteCoffee' })
    async delete(@Args('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }

    @Subscription(() => Coffee)
    coffeeAdded() {
        return this.pubSub.asyncIterator('CoffeeAdded');
    }
}
