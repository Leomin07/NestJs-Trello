import { Conversation } from 'src/chats/entities/conversation.entity';
import { Message } from 'src/chats/entities/message.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @ManyToMany(() => Conversation, { cascade: true })
  conversation: Conversation[];

  @OneToMany(() => Message, (message) => message.user)
  message: Message[];
}
