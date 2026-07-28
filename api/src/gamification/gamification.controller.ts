import { Controller, Post, Get, Put, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('settings')
  @UseGuards(FirebaseAuthGuard)
  async getSettings(@Req() req: any) {
    return this.gamificationService.getSettings(req.user);
  }

  @Put('settings')
  @UseGuards(FirebaseAuthGuard)
  async updateSettings(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can update gamification settings');
    }
    return this.gamificationService.updateSettings(body, req.user);
  }

  @Get('badges')
  @UseGuards(FirebaseAuthGuard)
  async getBadges(@Req() req: any) {
    return this.gamificationService.getBadges(req.user);
  }

  @Post('badges')
  @UseGuards(FirebaseAuthGuard)
  async createBadge(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can create badges');
    }
    return this.gamificationService.createBadge(body, req.user);
  }
}
