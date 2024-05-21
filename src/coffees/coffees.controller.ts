import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly service: CoffeesService) {}

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.service.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() coffeeDto: CreateCoffeeDto) {
        return this.service.create(coffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() coffeeDto: UpdateCoffeeDto) {
        return this.service.update(id, coffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
