import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coffee } from './coffee.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'flavor model' })
@Entity()
export class Flavor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Coffee, (coffee) => coffee.flavors)
    coffees: Coffee[];
}
