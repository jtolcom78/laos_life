import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommonCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string; // e.g., 'CAR_BRAND'

    @Column()
    code: string; // e.g., 'HYUNDAI'

    @Column()
    valueKo: string; // Korean

    @Column()
    valueEn: string; // English

    @Column()
    valueLo: string; // Lao

    @Column()
    valueZh: string; // Chinese

    @Column({ default: 0 })
    order: number;

    @Column({ default: true })
    isActive: boolean;
}
