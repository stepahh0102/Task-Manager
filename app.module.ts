import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { MessagesModule } from './messages/messages.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import { Message } from './messages/message.entity';
import { PasswordReset } from './entities/password_resets.entity';
import { LogsModule } from './logs/logs.module';
import { Log } from './entities/log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '127.0.0.1',
      port: 1433,
      username: 'sa',
      password: 'sas123',
      database: 'task_project',
      entities: [User, Task, Message, PasswordReset, Log],
      synchronize: false,
      logging: true,
      options: {
        trustServerCertificate: true,
        encrypt: false,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
    }),
    AdminModule,
    AuthModule,
    TasksModule,
    MessagesModule,
    UploadModule,
    UsersModule,
    LogsModule,
  ],
})
export class AppModule {}
