import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', default: {} })
    title: any;

    @Column('decimal')
    price: number;

    @Column({ default: 'Used' })
    condition: string; // New, Used

    @Column({ default: 'Available' })
    status: string; // Available, Reserved, Sold

    @Column('simple-array', { nullable: true })
    photos: string[];

    @Column({ type: 'jsonb', default: {} })
    description: any;

    @ManyToOne(() => User)
    seller: User;

    @Column({ default: 0 })
    viewCount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
