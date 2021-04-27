import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({synchronize:false})
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 200})
    content: string;
    
    @Column({ type: "varchar", length: 50})
    user_id: string;

    @Column({ default: false})
    completed: boolean;

    @Column({ type: 'timestamp', default: null})
    completedAt: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}