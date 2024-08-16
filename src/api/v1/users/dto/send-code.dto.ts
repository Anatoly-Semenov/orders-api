import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SendCodeToDto {
	@IsString()
	@ApiProperty()
	userEmail: string

	@IsString()
	@ApiProperty()
	phone: string
}
