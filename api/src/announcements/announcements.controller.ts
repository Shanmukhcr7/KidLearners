import { Controller, Post, Get, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createAnnouncement(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can create announcements');
    }
    return this.announcementsService.createAnnouncement(body, req.user);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getAnnouncements(@Req() req: any) {
    return this.announcementsService.getAnnouncements(req.user);
  }
}
