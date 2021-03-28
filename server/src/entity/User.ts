import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 30 })
    name: string;

    @Column({ type: "varchar", length: 50 })
    email: string;

    @Column({ type: "varchar", length: 100 })
    password: string;

    @Column({ type: "varchar", length: 30 })
    verifiedCode: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ type: "timestamp"})
    verifiedAt: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt!: string;
}