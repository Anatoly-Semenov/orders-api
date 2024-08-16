import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class GetUserDto extends CreateUserDto {
	@IsInt()
	@ApiProperty()
	id: number
}
