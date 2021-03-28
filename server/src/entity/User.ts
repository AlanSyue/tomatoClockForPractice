import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 30 })
    name: string;

    @Column({ type: "varchar", length: 50 })
    @IsEmail({}, { message: 'Incorrect email' })
    @IsNotEmpty({ message: 'The email is required' })
    email: string;

    @Column({ type: "varchar", length: 100 })
    @Length(8, 100, { message: 'The password must be at least 8' })
    @IsNotEmpty({ message: 'The password is required' })
    password: string;

    @Column({ type: "varchar", length: 30 })
    verifiedCode: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ type: 'timestamp' })
    verifiedAt: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: string;

}