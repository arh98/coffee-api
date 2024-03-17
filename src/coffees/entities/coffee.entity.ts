import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity('coffees')
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @JoinTable()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ManyToMany((type) => Flavor, (flavor) => flavor.coffees)
    flavors: Flavor[];
}
