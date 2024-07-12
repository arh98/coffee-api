import { registerEnumType } from '@nestjs/graphql';

export enum CoffeeType {
    ARABICA = 'Arabica',
    ROBUSTA = 'Rubasta',
}

registerEnumType(CoffeeType, {
    name: 'CoffeeType',
});
