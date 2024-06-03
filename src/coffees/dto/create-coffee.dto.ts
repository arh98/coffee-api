import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
    @ApiProperty({ description: 'the name of the coffee' })
    @IsString()
    readonly title: string;

    @ApiProperty({ description: 'the brand of the coffee' })
    @IsString()
    readonly brand: string;

    // @IsString()
    // readonly description: string = '';

    @ApiProperty({ example: [] })
    @IsString({
        each: true,
    })
    readonly flavors?: string[] = [];
}
