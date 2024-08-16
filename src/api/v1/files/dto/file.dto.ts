import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class FileDto {
	@ApiProperty({
		description: 'Client app id',
		type: Number || String,
	})
	@IsString()
	@IsInt()
	@IsOptional()
	readonly appId?: number | string

	@ApiProperty({
		description: 'User id to whom files will be added',
		type: Number || String,
	})
	@IsString()
	@IsInt()
	@IsOptional()
	readonly userId?: number | string

	@ApiProperty({
		description: 'Service id',
		type: Number || String,
	})
	@IsString()
	@IsInt()
	@IsOptional()
	readonly serviceId?: number | string

	@ApiProperty({
		description: 'Address id',
		type: Number || String,
	})
	@IsString()
	@IsInt()
	@IsOptional()
	readonly addressId?: number | string

	@ApiProperty({
		required: false,
		description: 'Позиция элемента для сортировки',
	})
	@IsOptional()
	readonly sortPosition?: number
}
