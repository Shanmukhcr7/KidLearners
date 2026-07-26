import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('admin')
@UseGuards(FirebaseAuthGuard) // Further restricted by custom claims in a real app, but for now we rely on the guard
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('schools')
  getSchools() {
    return this.adminService.getSchools();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }
}
