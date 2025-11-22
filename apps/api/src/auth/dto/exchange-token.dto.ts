import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ExchangeTokenDto {
  @ApiProperty({ 
    description: 'Supabase access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  @Length(100, 2000, { message: 'Token must be between 100 and 2000 characters' })
  @Matches(/^[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_.+/=]*$/, {
    message: 'Invalid token format'
  })
  supabaseToken!: string;
}
