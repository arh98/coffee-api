import { PaginationQueryDto } from './../common/pagination-query.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { DataSource, Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { EventEntity } from 'src/events/entities/event.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepo: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepo: Repository<Flavor>,
        private readonly dataSource: DataSource,
    ) {}

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        return this.coffeeRepo.find({
            relations: ['flavors'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: any) {
        const coffee = await this.coffeeRepo.findOne({
            where: { id },
            relations: ['flavors'],
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map((name) =>
                this.preloadFlavorByName(name),
            ),
        );

        const coffee = this.coffeeRepo.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeeRepo.save(coffee);
    }

    async update(id: any, updateCoffeeDto: any) {
        const flavors =
            updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map((name: string) =>
                    this.preloadFlavorByName(name),
                ),
            ));

        const coffee = await this.coffeeRepo.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        });
        if (!coffee) {
            throw new NotFoundException('Could not find coffee');
        }
        return this.coffeeRepo.save(coffee);
    }

    async remove(id: any) {
        const coffee = await this.coffeeRepo.findOne(id);
        return this.coffeeRepo.remove(coffee);
    }

    async recommendCoffee(coffee: Coffee): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;

            const recommendEvent = new EventEntity();
            recommendEvent.title = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffee: coffee.id };

            await queryRunner.manager.save(recommendEvent);
            await queryRunner.manager.save(coffee);

            await queryRunner.commitTransaction();
        } catch (ex) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepo.findOneBy({ name });
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepo.create({ name });
    }
}
