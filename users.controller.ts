import { Controller, Put, Body, UseGuards, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

interface RequestWithUser {
  user: {
    id: number;
    username: string;
    role: string;
  };
}

interface UpdateProfileDto {
  username: string;
  email: string;
  bio?: string;
  phone?: string;
  location?: string;
}

interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Put('profile')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    const { username, email, bio, phone, location } = body;

    await this.userRepository.update(userId, {
      username,
      email,
      bio: bio || '',
      phone: phone || '',
      location: location || '',
    });

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    return {
      success: true,
      message: 'Профиль обновлён',
      user: updatedUser,
    };
  }

  @Put('change-password')
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() body: ChangePasswordDto,
  ) {
    const userId = req.user.id;
    const { oldPassword, newPassword } = body;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: 'Пользователь не найден' };
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Неверный текущий пароль' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });

    return { success: true, message: 'Пароль успешно изменён' };
  }
}
