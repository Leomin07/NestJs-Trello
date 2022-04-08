import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, email, phone } = createUserDto;
    const duplicate = await this.authRepository.findOne({
      where: { username },
    });

    if (duplicate) throw new BadRequestException('Duplicate username');

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.username = username;
    user.email = email;
    user.phone = phone;
    user.password = hashPassword;

    await this.authRepository.save(user);
  }

  async login(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = createUserDto;

    const user = await this.authRepository.findOne({
      where: { username },
      select: ['id', 'password'],
    });

    if (!user) throw new NotFoundException('User not found');

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) throw new BadRequestException('password is not correct');

    return await this.getToken(username);
  }

  async refreshToken(
    accessToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const token = accessToken.replace('Bearer ', '');
    const verifyToken = await this.jwtService.verify(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
    if (!verifyToken) throw new Error('refreshToken is not valid');
    return await this.getToken(verifyToken.username);
  }

  async getToken(
    username: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async fetchProfile(username: string): Promise<User> {
    const user = await this.authRepository.findOne({
      username,
    });
    return user;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    username: string,
  ): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;
    if (oldPassword === newPassword)
      throw new BadRequestException('old password and new password not equal');

    const user = await this.authRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });

    const { password } = user;

    if (!user) throw new NotFoundException('user not found');

    const verify = await bcrypt.compare(oldPassword, password);

    if (!verify) throw new BadRequestException('password invalid');

    const genSalt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, genSalt);

    user.password = hashPassword;

    await this.authRepository.save(user);
  }

  async verifyToken(accessToken: string): Promise<any> {
    return this.jwtService.verify(accessToken, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  }
}
