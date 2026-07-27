import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createTask(@Body() body: { title: string; target: string; dueDate: string }, @Request() req: any) {
    const role = req.user.role;
    const schoolId = req.user.schoolId;
    return this.tasksService.createTask(body.title, body.target, body.dueDate, role, schoolId);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getTasks(@Request() req: any) {
    const role = req.user.role;
    const schoolId = req.user.schoolId;
    return this.tasksService.getTasks(role, schoolId);
  }
}
