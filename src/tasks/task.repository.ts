import { Prisma, Task } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/services/prisma.service';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async task(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });
  }

  async create(taskCreateInput: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data: taskCreateInput });
  }

  async delete(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
  ): Promise<Task> {
    return this.prisma.task.delete({
      where: taskWhereUniqueInput,
    });
  }

  async patchTaskStatus(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
    taskStatus: TaskStatus,
  ): Promise<Task> {
    return this.prisma.task.update({
      where: taskWhereUniqueInput,
      data: {
        status: taskStatus,
      },
    });
  }
}
