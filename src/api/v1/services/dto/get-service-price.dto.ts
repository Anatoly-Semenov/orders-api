import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

export class GetServicePriceDto {
	@ApiProperty({
		required: false,
	})
	@IsString()
	readonly type: 'prepayment' | 'payment' = 'payment'

	@ApiProperty({
		required: false,
	})
	@IsArray()
	readonly weekDays: string[]

	@ApiProperty({
		required: false,
		default: '11:00',
	})
	@IsOptional()
	@IsString()
	readonly timeStart?: string

	@ApiProperty({
		required: false,
		default: '12:00',
	})
	@IsOptional()
	@IsString()
	readonly timeEnd?: string

	@ApiProperty({
		required: false,
		default: new Date(),
	})
	@IsString()
	readonly dateStart: string

	@ApiProperty({
		required: false,
		default: new Date(),
	})
	@IsString()
	readonly dateEnd: string

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	readonly durationHour?: number

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsInt()
	readonly durationMinutes?: number

	@ApiProperty({
		required: false,
	})
	@IsInt()
	readonly amountPeople: number

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	readonly target: string | number
}
