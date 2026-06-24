import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveAvatar(userId: number, filename: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (user.avatar) {
      const oldPath = path.join('./uploads/avatars', user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.avatar = filename;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Аватар сохранён',
      avatar: filename,
    };
  }

  async deleteAvatar(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.avatar) {
      return { success: false, message: 'Аватар не найден' };
    }

    const avatarPath = path.join('./uploads/avatars', user.avatar);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    user.avatar = '';
    await this.userRepository.save(user);

    return { success: true, message: 'Аватар удалён' };
  }
}
