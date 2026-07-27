import { Controller, Get, Post, Body, UseGuards, Request, Ip } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getLogs(@Request() req: any) {
    const role = req.user.role; 
    return this.auditLogsService.getLogs(role);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createLog(@Request() req: any, @Body() body: { action: string }, @Ip() ip: string) {
    const role = req.user.role;
    const uid = req.user.uid;
    const email = req.user.email;
    return this.auditLogsService.logAction(body.action, role, uid, email, ip);
  }
}
