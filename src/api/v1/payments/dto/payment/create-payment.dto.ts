import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator'
import { OrderPaymentStatuses } from 'src/api/v1/orders/enums/orders.enums'
import { EPaymentTypes } from 'src/api/v1/services/enums/service.enum'
import {
	Currency,
	EPaymentMethod,
	EPaymentProvider,
	EPaymentType,
	Language,
} from '../../enums/payments.enum'
import { ETinkoffPaymentMethod } from '../../enums/tinkoff/tinkoff.enum'

export class RealtionDto {
	@ApiProperty({
		default: 0,
	})
	@IsInt()
	readonly id: number
}

export class CreatePaymentDto {
	id?: number
	@ApiProperty({
		default: 100,
	})
	@IsNumber()
	amount: number

	@ApiProperty()
	@IsInt()
	@IsOptional()
	orderId?: number

	@ApiProperty()
	@IsInt()
	userEmail: string

	@ApiProperty()
	@IsInt()
	phone: string

	@ApiProperty()
	@IsArray()
	items?: any[]

	@ApiProperty({
		enum: Currency,
		default: Currency.RUB,
		required: false,
	})
	@IsOptional()
	@IsEnum(Currency)
	readonly currency?: Currency = Currency.RUB

	@IsOptional()
	@IsBoolean()
	readonly createFirstPaymentInBank?: boolean

	@ApiProperty({
		enum: Language,
		default: Language.RU,
		required: false,
	})
	@IsOptional()
	@IsEnum(Language)
	readonly language?: Language = Language.RU

	@ApiProperty({
		enum: OrderPaymentStatuses,
		default: OrderPaymentStatuses.NOTPAID,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderPaymentStatuses)
	readonly status?: OrderPaymentStatuses = OrderPaymentStatuses.NOTPAID

	@ApiProperty({
		enum: ETinkoffPaymentMethod,
		default: ETinkoffPaymentMethod.PREPAYMENT,
		required: false,
	})
	@IsOptional()
	@IsEnum(ETinkoffPaymentMethod)
	readonly providerPaymentMethod: ETinkoffPaymentMethod

	@ApiProperty({
		enum: EPaymentMethod,
		default: EPaymentMethod.OTHER,
		required: false,
	})
	@IsOptional()
	@IsEnum(EPaymentMethod)
	readonly method: EPaymentMethod

	@ApiProperty({
		enum: EPaymentType,
		default: EPaymentType.PREPAYMENT,
		required: false,
	})
	@IsOptional()
	@IsEnum(EPaymentType)
	readonly type: EPaymentType

	@ApiProperty({
		type: () => RealtionDto,
		default: RealtionDto,
	})
	@IsOptional()
	readonly order?: RealtionDto

	@ApiProperty({
		enum: EPaymentProvider,
		default: EPaymentProvider.TINKOFF,
		required: false,
	})
	@IsOptional()
	@IsEnum(EPaymentProvider)
	readonly provider?: EPaymentProvider = EPaymentProvider.TINKOFF

	@ApiProperty({
		default: false,
	})
	@IsBoolean()
	isFree: boolean

	createPaymentInOurDb? = true

	@ApiProperty()
	client?: any

	providerPaymentURL?: string
	providerPaymentDetails?: string
	providerPaymentStatus?: string
	providerPaymentErrorCode?: string
	providerPaymentId?: string
}
