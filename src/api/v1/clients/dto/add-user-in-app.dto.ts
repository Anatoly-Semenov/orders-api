import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt } from 'class-validator'

export class AddUserInAppDto {
	@IsInt()
	@ApiProperty()
	readonly id: number

	@IsEmail()
	@ApiProperty({
		required: false,
	})
	readonly userEmail?: string
}
