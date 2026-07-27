import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createExam(@Request() req: any, @Body() body: { title: string, duration: string, totalQuestions: number }) {
    const role = req.user.role; 
    return this.examsService.createExam(body.title, body.duration, body.totalQuestions, role);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getExams() {
    return this.examsService.getExams();
  }
}
