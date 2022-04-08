import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  user: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  message: Message[];
}
