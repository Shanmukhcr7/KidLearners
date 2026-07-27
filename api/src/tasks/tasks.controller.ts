import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createTask(@Request() req: any, @Body() body: { title: string, target: string, dueDate: string }) {
    const role = req.user.role; 
    return this.tasksService.createTask(body.title, body.target, body.dueDate, role);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getTasks() {
    return this.tasksService.getTasks();
  }
}
