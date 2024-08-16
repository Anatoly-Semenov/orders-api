import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { EOrder, EQueryFormat } from '../enums/filter.enums'

export class FilterDto {
	@IsInt()
	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	offset?: number | string = 0

	@IsInt()
	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	limit?: number | string = 25

	@IsEnum(EOrder)
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: EOrder,
	})
	order?: EOrder = EOrder.Asc

	@IsEnum(EQueryFormat)
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: EQueryFormat,
		default: EQueryFormat.AND,
	})
	queryFormat?: EQueryFormat = EQueryFormat.AND
}
