import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTaskById(id: string): Task {
    const task = this.tasks.find((e) => e.id === id);
    if (!task) throw new NotFoundException(`Task ${id} not found.`);
    return task;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((e) => e.status === status);
    }
    if (search) {
      tasks = tasks.filter((e) => {
        const matches =
          e.title.includes(search) || e.description.includes(search);
        return matches;
      });
    }
    return tasks;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(dto: CreateTaskDto): Task {
    const { title, description } = dto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    const found = this.getTaskById(id);
    const index = this.tasks.findIndex((e) => e.id === found.id);
    this.tasks.splice(index, 1);
  }

  patchTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
    const task = this.getTaskById(id);
    task.status = updateTaskStatusDto.status;
    return task;
  }
}
