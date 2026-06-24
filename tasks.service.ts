import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userId: number) {
    const tasks = await this.taskRepository.find({
      where: { userId },
      order: { priority: 'DESC', createdAt: 'DESC' },
      relations: ['responsible'],
    });

    const sortByPriority = (a: { priority: number }, b: { priority: number }) =>
      b.priority - a.priority;
    return {
      pending: tasks.filter((t) => t.status === 'pending').sort(sortByPriority),
      in_progress: tasks
        .filter((t) => t.status === 'in_progress')
        .sort(sortByPriority),
      completed: tasks
        .filter((t) => t.status === 'completed')
        .sort(sortByPriority),
      archived: tasks
        .filter((t) => t.status === 'archived')
        .sort(sortByPriority),
    };
  }

  async create(userId: number, createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create({
      userId,
      title: createTaskDto.title,
      description: createTaskDto.description || '',
      status: createTaskDto.status || 'pending',
      priority: createTaskDto.priority || 1,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      isFavorite: createTaskDto.isFavorite || false,
      responsibleId: createTaskDto.responsibleId || null,
    });
    return await this.taskRepository.save(task);
  }

  async update(userId: number, taskId: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }
    Object.assign(task, updateTaskDto);
    if (updateTaskDto.dueDate !== undefined) {
      task.dueDate = updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : null;
    }
    return await this.taskRepository.save(task);
  }

  async remove(userId: number, taskId: number) {
    const result = await this.taskRepository.delete({ id: taskId, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Задача не найдена');
    }
    return { message: 'Задача удалена' };
  }

  async complete(userId: number, taskId: number) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }
    task.status = 'completed';
    return await this.taskRepository.save(task);
  }

  async findOne(userId: number, taskId: number) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
      relations: ['responsible'],
    });
    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }
    return task;
  }

  async getUserEmail(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return { email: user?.email || null };
  }

  async getAllUsers(currentUserId: number) {
    return await this.userRepository.find({
      where: { id: currentUserId },
      select: ['id', 'username'],
    });
  }
}
