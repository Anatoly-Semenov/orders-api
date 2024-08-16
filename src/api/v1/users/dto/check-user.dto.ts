import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt } from 'class-validator'

export class CheckUserDto {
	@IsInt()
	@ApiProperty({
		description: 'User id',
		required: false,
	})
	id?: number

	@IsEmail()
	@ApiProperty({
		description: 'User email',
		required: false,
	})
	userEmail?: string
}
