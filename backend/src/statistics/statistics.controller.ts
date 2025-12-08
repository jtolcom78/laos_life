import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Request } from 'express';

@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) { }

    @Get('access')
    async getAccessStats() {
        return this.statisticsService.getAccessStats();
    }

    @Get('content')
    async getContentViewStats() {
        return this.statisticsService.getContentViewStats();
    }

    @Post('log')
    async logAccess(@Body() body: { path: string }, @Req() req: any) {
        // userId logic needs JWT, simplified for now
        const ip = req.ip || req.connection.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';
        // Assuming userId isn't typically sent in this simple log call from client for now
        await this.statisticsService.logAccess(ip as string, body.path, userAgent as string);
        return { success: true };
    }
}
