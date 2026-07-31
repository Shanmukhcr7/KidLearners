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

  @Post(':id')
  @UseGuards(FirebaseAuthGuard)
  async updateRequest(@Request() req: any, @Body() body: any) {
    // using req.params is standard, but @Param('id') id: string from @nestjs/common is better.
    // I'll just use the full import in a sec if needed, but since I don't want to mess up imports:
    return this.demoService.updateRequest(req.user?.role, req.params.id, body);
  }

  @Post(':id/delete')
  @UseGuards(FirebaseAuthGuard)
  async deleteRequest(@Request() req: any) {
    return this.demoService.deleteRequest(req.user?.role, req.params.id);
  }
}
