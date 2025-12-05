import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Shop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string; // Main category (Food, Service, Repair)

    @Column({ nullable: true })
    subCategory: string; // Korean Food, Massage, AC Repair

    @Column({ nullable: true })
    openingHours: string; // 09:00 - 18:00

    @Column({ type: 'float', default: 0 })
    rating: number;

    @Column()
    location: string;

    @Column('text')
    menuOrServices: string;

    @Column()
    phone: string;

    @Column('simple-array', { nullable: true })
    photos: string[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
