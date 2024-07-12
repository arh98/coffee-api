import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';
import { Drink } from 'src/common/interfaces/drink.interface';

@Entity()
@ObjectType({ description: 'coffee model', implements: () => Drink })
export class Coffee implements Drink {
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

    @CreateDateColumn()
    createdAt?: Date;
}
// without enabling cli plugin , we have to manually annotate props with @Field()
