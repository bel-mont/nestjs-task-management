import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from '.prisma/client';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.task({ id });
    if (!task) throw new NotFoundException(`Task ${id} not found.`);
    return task;
  }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((e) => e.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((e) => {
  //       const matches =
  //         e.title.includes(search) || e.description.includes(search);
  //       return matches;
  //     });
  //   }
  //   return tasks;
  // }

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.findMany(filterDto);
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const task: Task = await this.taskRepository.create({
      ...dto,
      status: TaskStatus.OPEN,
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
  ): Promise<Task> {
    return this.taskRepository.patchTaskStatus(
      { id },
      updateTaskStatusDto.status,
    );
  }
}
