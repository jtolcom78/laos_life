import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RealEstate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    location: string;

    @Column('decimal')
    price: number; // USD (Monthly rent or Sale price)

    @Column({ default: 'Rent' })
    listingType: string; // Sale, Rent

    @Column({ default: 'Apartment' })
    propertyType: string; // Apartment, House, Land, Commercial

    @Column({ nullable: true })
    bedrooms: number;

    @Column({ nullable: true })
    bathrooms: number;

    @Column({ nullable: true })
    area: number; // sq meters

    @Column({ nullable: true })
    roomCount: number; // Legacy field

    @Column('simple-array', { nullable: true })
    photos: string[];

    @Column('jsonb', { nullable: true })
    mapCoords: { lat: number; lng: number };

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
