import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeInput } from './dto/create-coffee.input';
import { UpdateCoffeeInput } from './dto/update-coffee.input';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepo: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepo: Repository<Flavor>,
    ) {}

    async findAll() {
        return this.coffeeRepo.find();
    }

    async findOne(id: number) {
        const coffee = await this.coffeeRepo.findOne({ where: { id } });
        if (!coffee) throw new UserInputError('Could not find coffee');
        return coffee;
    }

    async create(input: CreateCoffeeInput) {
        const flavors = await Promise.all(
            input.flavors.map((name) => this.preloadFlavorByName(name)),
        );

        const coffee = this.coffeeRepo.create({
            ...input,
            flavors,
        });
        return this.coffeeRepo.save(coffee);
    }

    async update(id: number, input: UpdateCoffeeInput) {
        const flavors =
            input.flavors &&
            (await Promise.all(
                input.flavors.map((name: string) =>
                    this.preloadFlavorByName(name),
                ),
            ));

        const coffee = await this.coffeeRepo.preload({
            id,
            ...input,
            flavors,
        });
        if (!coffee) {
            throw new UserInputError('Coffee Does Not Exist!');
        }
        return this.coffeeRepo.save(coffee);
    }

    async delete(id: number) {
        const coffee = await this.findOne(id);
        return this.coffeeRepo.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepo.findOneBy({ name });
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepo.create({ name });
    }
}
