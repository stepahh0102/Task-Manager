/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { id: number; username: string; role: string };
}
@Controller('api/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send')
  async sendMessage(
    @Req() req: RequestWithUser,
    @Body() body: { toUserId: number; message: string },
  ) {
    if (!body.message || body.message.trim() === '') {
      return { success: false, message: 'Сообщение не может быть пустым' };
    }
    return await this.messagesService.sendMessage(
      req.user.id,
      body.toUserId,
      body.message,
    );
  }

  @Get('conversation/:userId')
  async getConversation(
    @Req() req: RequestWithUser,
    @Param('userId') userId: string,
  ) {
    return await this.messagesService.getConversation(
      req.user.id,
      parseInt(userId),
    );
  }

  @Get('dialogs')
  async getDialogs(@Req() req: RequestWithUser) {
    return await this.messagesService.getDialogs(req.user.id);
  }

  @Post('mark-read/:fromUserId')
  async markAsRead(
    @Req() req: RequestWithUser,
    @Param('fromUserId') fromUserId: string,
  ) {
    return await this.messagesService.markAsRead(
      req.user.id,
      parseInt(fromUserId),
    );
  }

  @Get('users')
  async getUsers(@Req() req: RequestWithUser) {
    return await this.messagesService.getAllUsers(req.user.id);
  }
}
