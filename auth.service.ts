import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User } from '../users/entities/user.entity';
import { PasswordReset } from '../entities/password_resets.entity';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким именем или email уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await this.userRepository.save(user);

    return { message: 'Регистрация успешна', userId: user.id };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    await this.userRepository.update(user.id, { lastLogin: new Date() });

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        success: false,
        message: 'Пользователь с таким email не найден',
      };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.passwordResetRepository.save({
      userId: user.id,
      token,
      expiresAt,
    });

    const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;

    await this.emailService.sendResetEmail(email, resetLink);

    console.log(`🔐 Токен для ${email}: ${token}`);
    console.log(`🔗 Ссылка: ${resetLink}`);

    return { success: true, message: 'Инструкция отправлена на email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const reset = await this.passwordResetRepository.findOne({
      where: { token, isUsed: false },
      relations: ['user'],
    });

    if (!reset || reset.expiresAt < new Date()) {
      throw new BadRequestException('Токен недействителен или истёк');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(reset.userId, {
      password: hashedPassword,
    });

    await this.passwordResetRepository.update(reset.id, { isUsed: true });

    return { success: true, message: 'Пароль успешно изменён' };
  }
}
