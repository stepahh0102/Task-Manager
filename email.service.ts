import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface TaskEmail {
  title: string;
  description?: string;
  status: string;
  priority?: number;
  createdAt: Date;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST', 'smtp.mail.ru'),
      port: this.configService.get('EMAIL_PORT', 465),
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
    console.log('Email сервер настроен');
  }

  async sendTaskEmail(to: string, task: TaskEmail) {
    let priorityText = 'Низкий';
    if (task.priority === 2) {
      priorityText = 'Средний';
    } else if (task.priority === 3) {
      priorityText = 'Высокий';
    }
    const mailOptions = {
      from: 'mr_stepash1xx17112006@mail.ru',
      to: to,
      subject: `Задача: ${task.title}`,
      html: `
        <h2>Ваша задача</h2>
        <p><strong>Название:</strong> ${task.title}</p>
        <p><strong>Описание:</strong> ${task.description || 'Нет описания'}</p>
        <p><strong>Статус:</strong> ${task.status}</p>
        <p><strong>Приоритет:</strong> ${priorityText}</p>
        <p><strong>Создано:</strong> ${new Date(task.createdAt).toLocaleString()}</p>
        <hr>
        <a href="http://localhost:3000">Перейти в приложение</a>
      `,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Письмо отправлено на ${to}`);
      return { success: true, message: 'Письмо отправлено' };
    } catch (err) {
      console.error('Ошибка отправки:', err);
      return { success: false, message: 'Ошибка отправки' };
    }
  }

  async sendResetEmail(to: string, resetLink: string) {
    const mailOptions = {
      from: 'your-email@mail.ru',
      to: to,
      subject: 'Восстановление пароля',
      html: `
            <h2>Сброс пароля</h2>
            <p>Перейдите по ссылке для сброса пароля:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Ссылка действительна 1 час</p>
        `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Письмо для сброса пароля отправлено на ${to}`);
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }
  }
}
