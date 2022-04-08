import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  newPassword: string;
}
