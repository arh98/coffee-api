import { Injectable, Scope } from '@nestjs/common';
import DataLoader = require('dataloader');
import { Flavor } from '../entities/flavor.entity';
import { In, Repository } from 'typeorm';
import { Coffee } from '../entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable({ scope: Scope.REQUEST })
export class FlavorsByCoffeeLoader extends DataLoader<number, Flavor[]> {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepo: Repository<Coffee>,
    ) {
        super((keys) => this.BatchLoadFn(keys));
    }

    private async BatchLoadFn(Ids: readonly number[]) {
        const coffeesWithFlavors = await this.coffeeRepo.find({
            select: ['id'], // don't need a coffee object
            relations: {
                flavors: true,
            },
            where: { id: In(Ids as number[]) }, //only query requested coffees
        });
        // 2-dimensional array : position : which coffee flavors belong to
        return coffeesWithFlavors.map((coffee) => coffee.flavors);
    }
}
