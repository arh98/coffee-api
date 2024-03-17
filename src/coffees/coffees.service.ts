import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly _coffeeRepo: Repository<Coffee>,
    ) {}

    findAll() {
        return this._coffeeRepo.find({
            relations: ['flavors'],
        });
    }

    async findOne(id: any) {
        const coffee = await this._coffeeRepo.findOne({
            where: { id },
            relations: ['flavors'],
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = [];

        const coffee = this._coffeeRepo.create({
            ...createCoffeeDto,
            flavors,
        });
        return this._coffeeRepo.save(coffee);
    }

    async update(id: any, updateCoffeeDto: any) {
        const coffee = await this._coffeeRepo.preload({
            id: +id,
            ...updateCoffeeDto,
        });
        if (!coffee) {
            throw new NotFoundException('Could not find coffee');
        }
        return this._coffeeRepo.save(coffee);
    }

    async remove(id: any) {
        const coffee = await this._coffeeRepo.findOne(id);
        return this._coffeeRepo.remove(coffee);
    }
}
