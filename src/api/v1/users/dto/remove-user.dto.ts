import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class RemoveUserDto {
	@IsInt()
	@ApiProperty()
	userId: number
}
