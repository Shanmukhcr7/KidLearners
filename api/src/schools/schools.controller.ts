import { Controller, Post, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
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

  @Get('my-stats')
  @UseGuards(FirebaseAuthGuard)
  async getMyStats(@Request() req: any) {
    const role = req.user.role;
    const schoolId = req.user.schoolId;
    return this.schoolsService.getMyStats(role, schoolId);
  }

  @Post('invites/create')
  @UseGuards(FirebaseAuthGuard)
  async createInviteLink(@Body() body: { limit: number, expiryDays: number }, @Request() req: any) {
    const role = req.user.role;
    const schoolId = req.user.schoolId;
    return this.schoolsService.createInviteLink(role, schoolId, body.limit, body.expiryDays);
  }

  @Get('invites')
  @UseGuards(FirebaseAuthGuard)
  async getInviteLinks(@Request() req: any) {
    const role = req.user.role;
    const schoolId = req.user.schoolId;
    return this.schoolsService.getInviteLinks(role, schoolId);
  }

  @Post('invites/join/:token')
  @UseGuards(FirebaseAuthGuard)
  async joinSchoolWithToken(@Param('token') token: string, @Request() req: any) {
    // Note: The user might already be a student or a completely new user
    const uid = req.user.uid;
    const email = req.user.email;
    return this.schoolsService.joinSchoolWithToken(token, uid, email);
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

  @Put(':id/features')
  @UseGuards(FirebaseAuthGuard)
  async updateFeatures(@Request() req: any, @Param('id') id: string, @Body() features: any) {
    const role = req.user.role;
    return this.schoolsService.updateFeatures(id, features, role);
  }
}
