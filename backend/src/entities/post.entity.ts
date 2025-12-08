import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', default: {} })
    title: any;

    @Column({ nullable: true })
    category: string;

    @Column({ nullable: true })
    thumbnail: string;

    @Column('simple-array', { nullable: true })
    attachments: string[];

    @Column({ type: 'jsonb', default: {} })
    content: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
