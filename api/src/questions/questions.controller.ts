import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createQuestion(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can create questions');
    }
    return this.questionsService.createQuestion(body, req.user);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getQuestions(@Req() req: any) {
    return this.questionsService.getQuestions(req.user);
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async updateQuestion(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can update questions');
    }
    return this.questionsService.updateQuestion(id, body, req.user);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async deleteQuestion(@Param('id') id: string, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can delete questions');
    }
    return this.questionsService.deleteQuestion(id, req.user);
  }
}
