import { Task, User } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  private logger = new Logger('TasksController', {
    timestamp: true,
  });
  constructor(private tasksService: TasksService) {}

  @Get(':id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`User ${user.username} fetched task ${id}`);
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() dto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(dto, user);
  }

  @Get('')
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} fetched task`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.patchTaskStatus(id, updateTaskStatusDto, user);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.deleteTask(id);
  }
}
