import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum CategoryGroup {
    A = 'A', // Used, RealEstate, Rent, Car, Job
    B = 'B', // Food, Repair, Cleaning, Service
    C = 'C', // Government News
}

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: CategoryGroup,
        default: CategoryGroup.A // Default value to avoid issues
    })
    group: CategoryGroup;

    @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentId' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @Column({ nullable: true })
    parentId: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
