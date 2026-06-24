import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  username: string;

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column({ name: 'entity_id', nullable: true, type: 'int' })
  entityId: number | null;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  details: string | null;

  @Column({ name: 'ip_address', nullable: true, type: 'nvarchar', length: 50 })
  ipAddress: string | null;

  @Column({ name: 'user_agent', nullable: true, type: 'nvarchar', length: 500 })
  userAgent: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
