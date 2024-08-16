import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { UserMeta } from '../enums/user-meta.emum'

export class CreateUserMetaDto {
	@IsString()
	@ApiProperty()
	@IsOptional()
	readonly firstName?: UserMeta

	@IsString()
	@ApiProperty()
	@IsOptional()
	readonly lastName?: string
}
