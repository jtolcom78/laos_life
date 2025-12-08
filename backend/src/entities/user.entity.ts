import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SELLER = 'SELLER',
}

export enum SocialLoginType {
    GOOGLE = 'GOOGLE',
    FB = 'FB',
    WHATSAPP = 'WHATSAPP',
    NONE = 'NONE',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password?: string;

    @Column()
    nickname: string;

    @Column({ nullable: true })
    phone: string;

    @Column({
        type: 'enum',
        enum: SocialLoginType,
        default: SocialLoginType.NONE,
    })
    socialLoginType: SocialLoginType;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: ['LO', 'KO', 'EN', 'ZH'],
        default: 'LO'
    })
    preferred_language: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
