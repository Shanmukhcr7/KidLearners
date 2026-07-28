import { Controller, Post, Get, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { EventsService } from './events.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createEvent(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin' && req.user?.role !== 'teacher') {
      throw new UnauthorizedException('Only staff can create events');
    }
    return this.eventsService.createEvent(body, req.user);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getEvents(@Req() req: any) {
    return this.eventsService.getEvents(req.user);
  }
}
