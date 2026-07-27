import { Controller, Post, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createCourse(@Request() req: any, @Body() body: { title: string, description: string }) {
    const role = req.user.role; 
    const uid = req.user.uid; 
    return this.coursesService.createCourse(body.title, body.description, role, uid);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getCourses() {
    return this.coursesService.getCourses();
  }

  @Put(':id/status')
  @UseGuards(FirebaseAuthGuard)
  async updateStatus(@Request() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    const role = req.user.role;
    return this.coursesService.updateCourseStatus(id, body.status, role);
  }
}
