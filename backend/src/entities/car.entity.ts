import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    brand: string; // Hyundai, Kia, Toyota, etc.

    @Column()
    model: string; // Sonata, Morning, Camry

    @Column()
    year: number;

    @Column()
    color: string;

    @Column()
    mileage: number; // km

    @Column()
    transmission: string; // Auto, Manual

    @Column()
    fuelType: string; // Gasoline, Diesel, Hybrid, Electric

    @Column('decimal')
    price: number; // USD

    @Column({ type: 'jsonb', default: {} })
    location: any; // Vientiane, etc.

    @Column('simple-array', { nullable: true })
    photos: string[];

    @Column({ type: 'jsonb', nullable: true, default: {} })
    description: any;

    @Column({ nullable: true })
    contact: string;

    @Column({ default: 0 })
    viewCount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
