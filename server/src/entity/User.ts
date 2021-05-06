import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Task } from './Task';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 200 })
    salt!: string;

    @Column({ type: "varchar", length: 200 })
    hash!: string;

    @Column({ type: "varchar", length: 200 })
    name!: string;

    @Column({ type: "varchar", length: 200 })
    email!: string;

    @Column({ type: "boolean", default: false })
    emailVerifiedStatus!: boolean;

    @Column({ type: "varchar", length: 36 })
    emailVerifiedCode!: string;

    @CreateDateColumn()
    createdAt!: string;

    @UpdateDateColumn()
    updatedAt!: string;

    @OneToMany(() => Task, task => task.user)
    tasks!: Task[];
}
