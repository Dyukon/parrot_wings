import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  id: string

  @ApiProperty({ default: 'Test' })
  name: string

  @ApiProperty({ default: 'test@test.test' })
  email: string

  @ApiProperty({ default: 450 })
  balance: number
}