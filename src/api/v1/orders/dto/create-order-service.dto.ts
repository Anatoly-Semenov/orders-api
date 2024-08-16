import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDecimal, IsEnum, IsInt, IsString } from 'class-validator'
import { EAdditionalTypes, EPaymentTypes, EServiceTypes } from '../../services/enums/service.enum'
export class CreateOrderServiceRelationDto {
	@ApiProperty()
	@IsInt()
	readonly id: number
}

export class CreateOrderAdditionalServiceDto {
	@ApiProperty()
	@IsString()
	readonly title: string

	@ApiProperty({
		enum: EAdditionalTypes,
		default: EAdditionalTypes.REQUISITE,
	})
	@IsEnum(EAdditionalTypes)
	readonly additionalType: string = EAdditionalTypes.REQUISITE

	@ApiProperty({
		enum: EPaymentTypes,
		default: EPaymentTypes.TIME,
	})
	@IsEnum(EPaymentTypes)
	readonly paymentTypes: string = EPaymentTypes.TIME

	@ApiProperty({
		type: CreateOrderServiceRelationDto,
		required: true,
	})
	readonly service: CreateOrderServiceRelationDto
	@IsInt()
	@ApiProperty()
	readonly duration: number = 0

	@ApiProperty()
	@IsInt()
	readonly count: number

	@ApiProperty()
	@IsDecimal()
	readonly price: number
}

export class CreateOrderFreeAdditionalServiceDto {
	@ApiProperty()
	@IsString()
	readonly title: string

	@ApiProperty({
		enum: EAdditionalTypes,
		default: EAdditionalTypes.REQUISITE,
	})
	@IsEnum(EAdditionalTypes)
	readonly additionalType: string = EAdditionalTypes.REQUISITE

	@ApiProperty({
		enum: EPaymentTypes,
		default: EPaymentTypes.TIME,
	})
	@IsEnum(EPaymentTypes)
	readonly paymentTypes: string = EPaymentTypes.TIME

	@IsInt()
	@ApiProperty()
	readonly duration: number = 0

	@ApiProperty()
	@IsInt()
	readonly count: number

	@ApiProperty()
	@IsDecimal()
	readonly price: number
}

export class CreateOrderServiceTargetRelationDto {
	@ApiProperty()
	@IsInt()
	readonly id: number
}
export class CreateOrderServiceDto {
	@ApiProperty()
	@IsInt()
	readonly id: number

	@ApiProperty()
	@IsString()
	readonly title: string

	@ApiProperty({
		type: CreateOrderServiceTargetRelationDto,
	})
	target: CreateOrderServiceTargetRelationDto

	@ApiProperty({
		enum: EServiceTypes,
		default: EServiceTypes.Rent,
	})
	@IsEnum(EServiceTypes)
	readonly type: EServiceTypes.Rent

	@ApiProperty()
	@IsInt()
	readonly seatsAmount: number

	@ApiProperty()
	@IsInt()
	readonly count: number

	@ApiProperty()
	@IsInt()
	readonly duration: number

	@ApiProperty({
		type: CreateOrderServiceRelationDto,
		required: true,
	})
	readonly service: CreateOrderServiceRelationDto

	@ApiProperty({
		type: [CreateOrderAdditionalServiceDto],
	})
	readonly additionalServices: CreateOrderAdditionalServiceDto[]

	@ApiProperty({
		type: [CreateOrderFreeAdditionalServiceDto],
	})
	readonly freeAdditionalServices: CreateOrderFreeAdditionalServiceDto[]

	@ApiProperty({
		type: [String],
	})
	@IsArray()
	readonly weekDays: string[]

	price: number
}
