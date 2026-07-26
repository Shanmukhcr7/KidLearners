import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createSchool(@Request() req: any, @Body() body: { name: string, domain: string, adminEmail: string }) {
    const role = req.user.role; // Custom claim set during sync
    return this.schoolsService.createSchool(body.name, body.domain, body.adminEmail, role);
  }

  @Get('stats')
  async getStats() {
    return this.schoolsService.getStats();
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getSchools(@Request() req: any) {
    const role = req.user.role;
    return this.schoolsService.getSchools(role);
  }

  @Get(':id/students')
  @UseGuards(FirebaseAuthGuard)
  async getStudents(@Request() req: any, @Param('id') id: string) {
    const role = req.user.role;
    // req.user.schoolId would be injected if we saved it in claims, for now we pass a dummy ID
    const userSchoolId = req.user.schoolId || 'default_school_id'; 
    return this.schoolsService.getStudents(id, role, userSchoolId);
  }
}
