import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { DemoService } from './demo.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('demo-requests')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createRequest(@Request() req: any, @Body() body: any) {
    return this.demoService.createRequest(req.user.uid, body);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getRequests(@Request() req: any) {
    console.log(`[DemoController] GET /demo-requests called by user: ${req.user?.uid}, role: ${req.user?.role}`);
    return this.demoService.getRequests(req.user?.role);
  }
}
