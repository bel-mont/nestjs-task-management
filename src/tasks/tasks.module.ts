import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/services/prisma.service';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository, PrismaService],
})
export class TasksModule {}
