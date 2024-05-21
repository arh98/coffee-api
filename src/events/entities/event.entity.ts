import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// @Index(['name', 'type'])
@Entity('event')
export class EventEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Index()
    @Column()
    title: string;

    @Column('json')
    payload: Record<string, any>;
}
