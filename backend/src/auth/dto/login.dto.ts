import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'User email address', 
    example: 'user@example.com',
    maxLength: 255
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email!: string;

  @ApiProperty({ 
    description: 'User password', 
    minLength: 8, 
    maxLength: 128,
    example: 'SecurePass123!'
  })
  @IsString()
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  password!: string;
}
