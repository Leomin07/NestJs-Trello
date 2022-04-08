import { Entity } from 'typeorm';

@Entity()
export class JoinConversation {
  // @PrimaryGeneratedColumn()
  // id: number;
  // @ManyToOne(
  //   () => Conversation,
  //   (conversation) => conversation.joinConversation,
  // )
  // @JoinColumn()
  // conversation: Conversation[];
  // @ManyToOne(() => User, (user) => user.joinConversation)
  // @JoinColumn()
  // user: User;
}
