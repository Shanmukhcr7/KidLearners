import { Controller, Get, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get('global')
  async getGlobalLeaderboard() {
    return this.leaderboardsService.getGlobalLeaderboard();
  }

  @Get('school/:schoolId')
  @UseGuards(FirebaseAuthGuard)
  async getSchoolLeaderboard(@Request() req: any, @Param('schoolId') schoolId: string) {
    const role = req.user.role;
    const userSchoolId = req.user.schoolId;

    if (role !== 'super_admin' && userSchoolId !== schoolId) {
      throw new UnauthorizedException('You can only view your own school leaderboard');
    }

    return this.leaderboardsService.getSchoolLeaderboard(schoolId);
  }
}
