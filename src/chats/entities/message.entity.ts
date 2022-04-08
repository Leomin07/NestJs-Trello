import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.message)
  @JoinColumn()
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.message)
  @JoinColumn()
  user: User;
}
