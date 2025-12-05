import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    industry: string;

    @Column({ default: 'Full-time' })
    jobType: string; // Full-time, Part-time, Freelance

    @Column({ nullable: true })
    experience: string; // Entry, 1-3y, 3-5y, 5y+

    @Column({ nullable: true })
    salaryRange: string; // Negotiable, $500-$1000, etc.

    @Column('decimal', { nullable: true })
    salary: number; // Specific amount if applicable

    @Column()
    workingHours: string;

    @Column()
    contact: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
