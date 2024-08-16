import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator'

export class UserFindOneDto {
	@IsInt()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	id?: number

	@IsString()
	@IsOptional()
	@IsEmail()
	@ApiProperty({
		required: false,
	})
	userEmail?: string
}
