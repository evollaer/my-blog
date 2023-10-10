import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number;//感叹号表示非必填


    @Column()
    nickname!: string;

    @Column()
    avatar!: string;

    @Column()
    job!: string;

    @Column()
    introduce!: string;

}