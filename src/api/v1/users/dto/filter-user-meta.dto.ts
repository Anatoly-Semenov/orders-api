import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { UsersMeta } from '../entities/users-meta.entity'

export class FilterUsersMetaDto {
	@IsEnum(UsersMeta)
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: UsersMeta,
	})
	key?: UsersMeta

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	value?: string
}
