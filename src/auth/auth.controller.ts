import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './authorization.guard';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  signIn(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(createUserDto);
  }

  @Post('/refresh')
  refresh(
    @Headers('authorization') accessToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshToken(accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ): Promise<void> {
    return this.authService.changePassword(
      changePasswordDto,
      req.user.username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Req() req): Promise<User> {
    return this.authService.fetchProfile(req.user.username);
  }
}
