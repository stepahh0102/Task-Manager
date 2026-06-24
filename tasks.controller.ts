import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EmailService } from '../email/email.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: number;
    username: string;
    role: string;
    email: string;
  };
}

@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.tasksService.findAll(req.user.id);
  }

  @Get('users')
  async getUsers(@Req() req: RequestWithUser) {
    return await this.tasksService.getAllUsers(req.user.id);
  }

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    if (
      createTaskDto.responsibleId &&
      createTaskDto.responsibleId !== req.user.id
    ) {
      if (req.user.role !== 'admin') {
        throw new ForbiddenException(
          'Только администратор может назначать ответственного',
        );
      }
    }
    return this.tasksService.create(req.user.id, createTaskDto);
  }

  @Put(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    if (
      updateTaskDto.responsibleId !== undefined &&
      updateTaskDto.responsibleId !== req.user.id
    ) {
      if (req.user.role !== 'admin') {
        throw new ForbiddenException(
          'Только администратор может изменять ответственного',
        );
      }
    }
    return this.tasksService.update(req.user.id, +id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.tasksService.remove(req.user.id, +id);
  }

  @Patch(':id/complete')
  complete(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.tasksService.complete(req.user.id, +id);
  }

  @Post(':id/send-email')
  @HttpCode(HttpStatus.OK)
  async sendTaskEmail(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: { email?: string },
  ) {
    const task = await this.tasksService.findOne(req.user.id, +id);
    let targetEmail: string | undefined = body?.email;
    if (!targetEmail) {
      const user = await this.tasksService.getUserEmail(req.user.id);
      targetEmail = user.email || undefined;
    }
    if (!targetEmail) {
      return { success: false, message: 'Не указан email получателя' };
    }
    if (req.user.role !== 'admin' && targetEmail !== req.user.email) {
      return {
        success: false,
        message:
          'Обычные пользователи могут отправлять письма только на свой email',
      };
    }
    return await this.emailService.sendTaskEmail(targetEmail, task);
  }
}
