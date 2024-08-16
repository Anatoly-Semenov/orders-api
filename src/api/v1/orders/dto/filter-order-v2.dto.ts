import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDate, IsInt, IsOptional, IsString } from 'class-validator'
import { FilterStatuses } from '../enums/orders.enums'

export class FilterOrdersV2Dto {
	@IsInt()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: Number,
	})
	clientId: number

	@IsArray()
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: FilterStatuses,
		type: [String],
	})
	includeStatuses: string[]

	@IsArray()
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: FilterStatuses,
		type: [String],
	})
	excludeStatuses: string[]

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: String,
	})
	orderId: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: String,
	})
	userName: string

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
		type: [String],
	})
	paymentStatus: string[]

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: [Number],
	})
	addresses: number[]

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: [Number],
	})
	customers: number[]

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		type: [Number],
	})
	services: number[]

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

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	readonly onlyDates: boolean
}
