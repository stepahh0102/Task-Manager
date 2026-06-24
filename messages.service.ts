/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendMessage(fromUserId: number, toUserId: number, message: string) {
    const newMessage = this.messageRepository.create({
      fromUserId,
      toUserId,
      message,
    });
    await this.messageRepository.save(newMessage);

    return newMessage;
  }

  async getConversation(userId1: number, userId2: number) {
    return await this.messageRepository.find({
      where: [
        { fromUserId: userId1, toUserId: userId2 },
        { fromUserId: userId2, toUserId: userId1 },
      ],
      relations: ['fromUser', 'toUser'],
      order: { createdAt: 'ASC' },
    });
  }

  async getDialogs(userId: number) {
    const messages = await this.messageRepository.find({
      where: [{ fromUserId: userId }, { toUserId: userId }],
      relations: ['fromUser', 'toUser'],
      order: { createdAt: 'DESC' },
    });
    const dialogs = new Map();
    messages.forEach((msg) => {
      const otherId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
      if (!dialogs.has(otherId)) {
        dialogs.set(otherId, {
          user: msg.fromUserId === userId ? msg.toUser : msg.fromUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: msg.toUserId === userId && !msg.isRead ? 1 : 0,
        });
      } else if (msg.toUserId === userId && !msg.isRead) {
        const dialog = dialogs.get(otherId);
        dialog.unreadCount++;
      }
    });

    return Array.from(dialogs.values());
  }

  async markAsRead(userId: number, fromUserId: number) {
    await this.messageRepository.update(
      { fromUserId, toUserId: userId, isRead: false },
      { isRead: true },
    );
    return { success: true };
  }

  async getAllUsers(currentUserId: number) {
    return await this.userRepository.find({
      where: { id: Not(currentUserId) },
      select: ['id', 'username', 'email'],
    });
  }
}
