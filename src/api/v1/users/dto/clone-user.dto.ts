import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class CloneUserDto extends CreateUserDto {
	@IsInt()
	@ApiProperty()
	userId: number
}
