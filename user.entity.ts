import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Message } from '../../messages/message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'nvarchar', length: 20, default: 'user' })
  role: string;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  avatar: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'last_login', type: 'datetime2', nullable: true })
  lastLogin: Date | null;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Message, (message) => message.fromUser)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.toUser)
  receivedMessages: Message[];
}
