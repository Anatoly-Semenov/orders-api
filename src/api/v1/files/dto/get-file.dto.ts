import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class GetFileDto {
	@ApiProperty({
		description: 'Full file path (url)',
	})
	@IsOptional()
	@IsString()
	readonly fullPath?: string

	@ApiProperty({
		description: 'File id',
		required: true,
	})
	@IsOptional()
	@IsString()
	@IsInt()
	readonly fileId?: string | number
}
