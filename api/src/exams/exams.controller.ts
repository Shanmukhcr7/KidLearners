import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createExam(@Body() body: { title: string; duration: string; totalQuestions: number }, @Request() req: any) {
    const role = req.user.role;
    const schoolId = req.user.schoolId;
    return this.examsService.createExam(body.title, body.duration, body.totalQuestions, role, schoolId);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getExams(@Request() req: any) {
    const role = req.user.role;
    const schoolId = req.user.schoolId;
    return this.examsService.getExams(role, schoolId);
  }
}
