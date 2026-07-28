import { Controller, Get, Put, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':category')
  @UseGuards(FirebaseAuthGuard)
  async getSettings(@Param('category') category: string, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can view settings');
    }
    return this.settingsService.getSettings(category, req.user);
  }

  @Put(':category')
  @UseGuards(FirebaseAuthGuard)
  async updateSettings(@Param('category') category: string, @Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can update settings');
    }
    return this.settingsService.updateSettings(category, body, req.user);
  }
}
