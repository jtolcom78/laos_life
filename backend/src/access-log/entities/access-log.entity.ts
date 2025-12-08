import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AccessLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: true })
    ip: string;

    @Column({ nullable: true })
    path: string;

    @Column({ nullable: true })
    userAgent: string;

    @CreateDateColumn()
    created_at: Date;
}
