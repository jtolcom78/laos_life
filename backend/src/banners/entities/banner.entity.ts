import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Banner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'jsonb', nullable: true })
    images: { [key: string]: string };

    // Legacy support (optional, can be removed if we migrate data)
    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    linkUrl: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    sortOrder: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
