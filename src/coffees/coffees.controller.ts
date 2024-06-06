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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/common/decorators/public-decorator';
import { IntParserPipe } from 'src/common/pipes/int-parser/int-parser.pipe';
import { Protocol } from 'src/common/decorators/protocol-decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/authorization/decorators/role.decorator';
import { Role } from 'src/users/enums/user-role.enum';
import { Permission } from 'src/auth/authorization/permission.type';
import { Permissions } from 'src/auth/authorization/decorators/permission.decorator';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
    constructor(
        private readonly service: CoffeesService,
        private readonly configService: ConfigService,
    ) {
        console.log(this.configService.get<string>('DB_HOST'));
    }

    @Public()
    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.service.findAll(paginationQuery);
    }

    @ApiForbiddenResponse({ description: 'forbidden without api key' })
    @Get(':id')
    findOne(@Param('id', IntParserPipe) id: string) {
        return this.service.findOne(id);
    }

    // @Roles(Role.Admin)
    @Permissions(Permission.CreateCoffee)
    @Post()
    create(@Body() coffeeDto: CreateCoffeeDto) {
        return this.service.create(coffeeDto);
    }

    @Roles(Role.Admin)
    @Patch(':id')
    update(@Param('id') id: string, @Body() coffeeDto: UpdateCoffeeDto) {
        return this.service.update(id, coffeeDto);
    }

    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
