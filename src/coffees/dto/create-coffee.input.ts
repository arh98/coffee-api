import { InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateCoffeeInput {
    @MinLength(3)
    name: string;

    brand: string;

    flavors: string[];
}
