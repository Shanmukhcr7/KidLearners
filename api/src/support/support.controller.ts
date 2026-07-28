import { Controller, Post, Get, Put, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { SupportService } from './support.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createTicket(@Body() body: any, @Req() req: any) {
    return this.supportService.createTicket(body, req.user);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getTickets(@Req() req: any) {
    return this.supportService.getTickets(req.user);
  }

  @Post(':id/reply')
  @UseGuards(FirebaseAuthGuard)
  async replyToTicket(@Param('id') id: string, @Body() body: { message: string }, @Req() req: any) {
    return this.supportService.replyToTicket(id, body.message, req.user);
  }

  @Put(':id/status')
  @UseGuards(FirebaseAuthGuard)
  async updateTicketStatus(@Param('id') id: string, @Body() body: { status: string }, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can update ticket status');
    }
    return this.supportService.updateTicketStatus(id, body.status, req.user);
  }
}
