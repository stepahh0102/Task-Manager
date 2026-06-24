import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'createdAt', 'lastLogin'],
    });
    return users;
  }

  @Get('tasks')
  async getAllTasks() {
    return await this.taskRepository.find({
      relations: ['user', 'responsible'],
      order: { createdAt: 'DESC' },
    });
  }

  @Delete('users/:id')
  async deleteUser(
    @Param('id') id: string,
    @Body()
    body: {
      currentUserId?: number;
    },
  ) {
    const userId = parseInt(id);
    if (body.currentUserId === userId) {
      return { success: false, message: 'Нельзя удалить самого себя' };
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: 'Пользователь не найден' };
    }
    await this.taskRepository.delete({ userId: userId });
    await this.userRepository.delete(userId);
    return { success: true, message: 'Пользователь удалён' };
  }

  @Put('users/:id/role')
  async changeRole(@Param('id') id: string, @Body() body: { role: string }) {
    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(body.role)) {
      return { success: false, message: 'Недопустимая роль' };
    }

    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return { success: false, message: 'Пользователь не найден' };
    }

    await this.userRepository.update(parseInt(id), { role: body.role });
    return { success: true, message: `Роль изменена на ${body.role}` };
  }
}
