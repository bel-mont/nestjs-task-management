import { Prisma, Task, User } from '.prisma/client';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/db/services/prisma.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskRepository {
  private logger = new Logger('TasksController', {
    timestamp: true,
  });

  constructor(private readonly prisma: PrismaService) {}

  async task(taskWhere: Prisma.TaskWhereInput): Promise<Task> {
    return this.prisma.task.findFirst({
      where: taskWhere,
    });
  }

  async create(
    taskCreateInput: Prisma.TaskUncheckedCreateInput,
  ): Promise<Task> {
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
    taskWhere: Prisma.TaskWhereInput,
    taskStatus: TaskStatus,
  ): Promise<Task> {
    const task = await this.task(taskWhere);
    return this.prisma.task.update({
      where: { id: task.id },
      data: {
        status: taskStatus,
      },
    });
  }

  async findMany(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    try {
      const { status, search } = filter;
      const where: Prisma.TaskWhereInput = {
        userId: user.id,
      };
      if (status) {
        where.status = status;
      }
      if (search) {
        where.OR = [
          {
            title: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ];
      }
      const queryFilter: Prisma.TaskFindManyArgs = { where };
      return this.prisma.task.findMany(queryFilter);
    } catch {
      this.logger.verbose(`User ${user.username} fetched task`);
      throw new InternalServerErrorException();
    }
  }
}
