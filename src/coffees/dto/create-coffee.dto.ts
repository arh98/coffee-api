import { IsString } from '@nestjs/class-validator';

export class CreateCoffeeDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;

    @IsString({ each: true })
    readonly flavors?: string[];
}
