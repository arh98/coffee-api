import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity()
@ObjectType({ description: 'coffee model' })
export class Coffee {
    @PrimaryGeneratedColumn()
    @Field(() => ID, { description: 'unique identifier' })
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @JoinTable()
    @ManyToMany(() => Flavor, (flavor) => flavor.coffees, {
        cascade: true,
    })
    flavors?: Flavor[];
}
// without enabling cli plugin , we have to manually annotate props with @Field()
