import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class CreateUserDTO implements Partial<User> {
  @ApiProperty({
    type: String,
    example: 'password',
  })
  password?: string;

  @ApiProperty({
    type: String,
    example: 'username',
  })
  username?: string;
}
