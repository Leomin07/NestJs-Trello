import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(10)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(10)
  phone: string;
}
