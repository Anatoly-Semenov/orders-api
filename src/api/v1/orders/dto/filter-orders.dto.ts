import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator'

import { FilterDto } from 'src/utils/filter/dto/filter.dto'
import { EOrderFilterOrderField } from '../enums/orders.enums'

export class FilterOrdersDto extends FilterDto {
	@IsString()
	@IsOptional()
	@IsInt()
	@ApiProperty({
		required: false,
		type: String,
	})
	id: number | string

	@IsString()
	@IsOptional()
	@IsInt()
	@ApiProperty({
		required: false,
		type: String,
	})
	userId: number | string

	@IsString()
	@IsOptional()
	@IsInt()
	@ApiProperty({
		required: false,
		type: String,
	})
	mainServiceId: number | string

	@IsString()
	@IsOptional()
	@IsInt()
	@ApiProperty({
		required: false,
		type: String,
	})
	orderId: number | string

	@IsString()
	@IsOptional()
	@IsInt()
	@ApiProperty({
		required: false,
		type: String,
	})
	staffId: number | string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: String,
	})
	userPhone: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: String,
	})
	userEmail: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: String,
	})
	status: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: String,
	})
	services: string

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: Boolean,
	})
	paymentIsFree: boolean

	@IsDate()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: Date,
	})
	dateTimeStart: Date

	@IsDate()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	dateTimeEnd: Date

	@IsEnum(EOrderFilterOrderField)
	@IsInt()
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: EOrderFilterOrderField,
	})
	orderField: EOrderFilterOrderField
}
