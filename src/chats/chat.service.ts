import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ConversationDto } from './dto/conversation.dto';
import { JoinConversationDto } from './dto/join-conversation.dto';
import { LeaveConversationDto } from './dto/leaveConversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getAllMessage(): Promise<Conversation[]> {
    return this.conversationRepository.find();
  }

  async listConversationByUser(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) throw new BadRequestException('user not found');
    const list = await this.conversationRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'u')
      .andWhere(`u.username = :username`, { username: username })
      .getMany();
    return list;
  }

  async checkMember(userId: number): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new BadRequestException('user not found');
    return user;
  }

  async checkConversation(conversationId: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne(
      conversationId,
      { relations: ['user'] },
    );
    if (!conversation) throw new BadRequestException('conversation not found');
    return conversation;
  }

  async messageByConversation(conversationId: number): Promise<Conversation> {
    return this.conversationRepository.findOne(conversationId, {
      relations: ['message'],
    });
  }

  async addMember(data: JoinConversationDto): Promise<Conversation> {
    const { conversationId, userId } = data;
    // check conversation
    const conversation = await this.checkConversation(conversationId);

    // check user
    const user = await this.checkMember(userId);

    conversation.user = [user];

    await this.conversationRepository.save(conversation);
    return conversation;
  }

  async createConversation(data: ConversationDto): Promise<Conversation> {
    const { title, userId } = data;
    const conversation = new Conversation();
    conversation.title = title;
    const isConversation = await this.conversationRepository.save(conversation);

    await this.addMember({ conversationId: conversation.id, userId });

    return isConversation;
  }

  async createMessage(sendMessage: SendMessageDto): Promise<Message> {
    const { conversationId, content, userId } = sendMessage;
    //check conversation
    const conversation = await this.checkConversation(conversationId);

    //check user
    const user = await this.checkMember(userId);

    const message = new Message();

    message.content = content;
    message.conversation = conversation;
    message.user = user;

    const isMessage = await this.messageRepository.save(message);
    return isMessage;
  }

  async leaveConversation(data: LeaveConversationDto): Promise<Conversation> {
    const { conversationId, userId } = data;

    await this.checkMember(userId);

    const isConversation = await this.checkConversation(conversationId);

    if (isConversation.user.find((i) => i.id !== userId))
      throw new BadRequestException('user is not in the room');

    isConversation.user = isConversation.user.filter(
      (user) => user.id !== userId,
    );
    await this.conversationRepository.save(isConversation);
    return isConversation;
  }
}
