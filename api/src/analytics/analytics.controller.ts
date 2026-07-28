import { Controller, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('global')
  @UseGuards(FirebaseAuthGuard)
  async getGlobalAnalytics(@Req() req: any) {
    if (req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Only super admins can view global analytics');
    }
    return this.analyticsService.getGlobalAnalytics();
  }

  @Get('schools')
  @UseGuards(FirebaseAuthGuard)
  async getSchoolsAnalytics(@Req() req: any) {
    if (req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Only super admins can view schools analytics');
    }
    return this.analyticsService.getSchoolsAnalytics();
  }
}
