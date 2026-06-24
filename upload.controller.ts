/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (allowed.includes(ext || '')) {
          cb(null, true);
        } else {
          cb(new Error('Только изображения!'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      return { success: false, message: 'Файл не загружен' };
    }

    const userId = req.user.id;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user?.avatar) {
      const oldPath = `./uploads/avatars/${user.avatar}`;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await this.userRepository.update(userId, { avatar: file.filename });

    return {
      success: true,
      message: 'Аватар сохранён',
      avatar: file.filename,
    };
  }

  @Delete('avatar')
  async deleteAvatar(@Req() req: any) {
    const userId = req.user.id;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user?.avatar) {
      return { success: false, message: 'Аватар не найден' };
    }

    const avatarPath = `./uploads/avatars/${user.avatar}`;
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    await this.userRepository.update(userId, { avatar: '' });

    return { success: true, message: 'Аватар удалён' };
  }
}
