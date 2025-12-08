import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsObject } from 'class-validator';

export class CreateBannerDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsObject()
    @IsOptional()
    images: { [key: string]: string };

    @IsString()
    @IsOptional()
    imageUrl?: string; // Keep for backward compatibility if needed, or remove if strict

    @IsString()
    @IsOptional()
    linkUrl?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}
