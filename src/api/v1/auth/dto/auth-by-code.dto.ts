import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AuthByCodeDto {
	@IsString()
	@ApiProperty()
	readonly code: string
}
