import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from './User';
@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.tasks)
    user!: User;
    
    @Column({ type: "varchar", length: 200 })
    content!: string;

    @Column({ default: false })
    completed!: boolean;

    @Column({ type: "timestamp", nullable: true })
    completedAt!: string;

    @CreateDateColumn()
    createdAt!: string;

    @UpdateDateColumn()
    updatedAt!: string;
}
