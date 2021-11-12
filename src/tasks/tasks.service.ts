import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task, User } from '.prisma/client';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.task({ id, userId: user.id });
    if (!task) throw new NotFoundException(`Task ${id} not found.`);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.findMany(filterDto, user);
  }

  async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
    const task: Task = await this.taskRepository.create({
      ...dto,
      status: TaskStatus.OPEN,
      userId: user.id,
    });

    return task;
  }

  async deleteTask(id: string): Promise<Task> {
    try {
      return await this.taskRepository.delete({ id });
    } catch {
      throw new NotFoundException(`Task ${id} was not found.`);
    }
  }

  async patchTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    return this.taskRepository.patchTaskStatus(
      { id, userId: user.id },
      updateTaskStatusDto.status,
    );
  }
}
