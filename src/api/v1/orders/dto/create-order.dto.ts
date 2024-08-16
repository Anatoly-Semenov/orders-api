import { ApiProperty } from '@nestjs/swagger'
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator'
import { Currency, Language } from '../../payments/enums/payments.enum'

import { EOrderSource, OrderPaymentStatuses, SaleTypes, Statuses } from '../enums/orders.enums'

import { CreateOrderServiceDto } from './create-order-service.dto'
import { CreateOrderCustomerDto } from './create-order-customer.dto'
import { CreatePaymentDto } from '../../payments/dto/payment/create-payment.dto'
export class OrderAddressDto {
	@ApiProperty()
	//@IsInt()
	readonly id: number
}

export class CreateOrderDto {
	id?: number

	@IsDate()
	@ApiProperty({
		description: 'Date and time start',
	})
	readonly dateTimeStart: Date | string

	@IsDate()
	@ApiProperty({
		description: 'Date and time end',
	})
	readonly dateTimeEnd: Date | string

	@MaxLength(200)
	@ApiProperty({
		description: 'Order comment',
		required: false,
	})
	readonly comment?: string // комментарий клиента

	//@IsInt()
	@ApiProperty({
		description: 'Sale amount',
		required: false,
	})
	readonly sale?: number // Размер скидки

	@IsEnum(Statuses)
	@ApiProperty({
		description: 'Order status',
		required: false,
		default: Statuses.Created,
		enum: Statuses,
	})
	status?: Statuses // Статус заказа

	@IsEnum(SaleTypes)
	@ApiProperty({
		description: 'Sale type',
		enum: SaleTypes,
		required: false,
	})
	readonly saleType?: SaleTypes //Тип скидки percent / amount

	//@IsInt()
	@ApiProperty({
		description: 'Final order amount',
		required: true,
		default: 0,
	})
	readonly amount: number

	//@IsInt()
	@ApiProperty({
		required: false,
		default: 0,
	})
	readonly duration?: number

	//@IsInt()
	@IsOptional()
	@ApiProperty({
		required: false,
		default: 0,
	})
	@IsOptional()
	readonly discount?: number

	@IsString()
	@ApiProperty({
		required: true,
		default: '',
	})
	readonly discountType: string

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		required: true,
		default: false,
	})
	readonly isCompleted?: boolean = false

	@IsEnum(Currency)
	@IsOptional()
	@ApiProperty({
		description: 'Order currency',
		required: false,
		default: Currency.RUB,
		enum: Currency,
	})
	readonly currency?: Currency

	@IsEnum(OrderPaymentStatuses)
	@IsOptional()
	@ApiProperty({
		required: false,
		default: OrderPaymentStatuses.NOTPAID,
		enum: OrderPaymentStatuses,
	})
	paymentStatus: OrderPaymentStatuses

	@ApiProperty({
		required: false,
		default: '',
	})
	datetimezone?: string

	@ApiProperty({
		type: [CreateOrderServiceDto],
		required: true,
	})
	@IsArray()
	orderServices: CreateOrderServiceDto[]

	@IsEnum(EOrderSource)
	@ApiProperty({
		enum: EOrderSource,
		default: EOrderSource.SUBCLIENT,
	})
	orderSource: EOrderSource = EOrderSource.SUBCLIENT

	@IsBoolean()
	@ApiProperty({
		default: true,
	})
	createFirstPayment: boolean

	@IsBoolean()
	@ApiProperty({
		default: false,
	})
	createFirstPaymentInBank?: boolean = false

	@ApiProperty({
		type: OrderAddressDto,
		required: true,
	})
	readonly address: OrderAddressDto

	@ApiProperty({
		type: [CreatePaymentDto],
		required: false,
	})
	@IsArray()
	payments: CreatePaymentDto[]

	@ApiProperty({
		type: CreateOrderCustomerDto,
	})
	customer: CreateOrderCustomerDto

	@ApiProperty({
		default: 0,
	})
	readonly clientId: number

	@ApiProperty()
	@IsNumber()
	price: number

	@ApiProperty()
	@IsString()
	@IsOptional()
	redirectDueDate?: string
}
