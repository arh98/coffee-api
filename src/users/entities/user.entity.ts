import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/user-role.enum';
import {
    Permission,
    PermissionType,
} from 'src/auth/authorization/permission.type';
import { ApiKey } from '../api-keys/entities/api-key.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ enum: Role, default: Role.Regular })
    role: Role;

    @Column({ enum: Permission, default: [], type: 'json' })
    permissions: PermissionType[];

    @JoinTable()
    @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
    apiKeys: ApiKey[];

    @Column({ nullable: true })
    googleId: string;

    @Column({ default: false })
    isTfaEnabled: boolean;

    @Column({ nullable: true })
    tfaSecret: string;
}
