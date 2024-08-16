import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { CreateServicesPriceSettingDto } from '../../services-price-settings/dto/create-services-price-setting.dto'

import {
	EAdditionalTypes,
	EBlockBookingType,
	EPaymentTypes,
	EServiceFormats,
	EServicePaymentTypes,
	EServicePrepayment,
	EServiceTypes,
} from '../enums/service.enum'
import { ServicesPrepaymentsSettingsDto } from './response/service-prepayment-settings.dto'
export class ParentServiceDto {
	@ApiProperty({
		description: 'id другой услуги',
	})
	readonly id: number
}

export class AdditionalServiceDto {
	@ApiProperty({
		description: 'id другой услуги',
	})
	readonly id: number

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'вкл/выкл услуги',
		required: false,
	})
	readonly isEnable?: boolean = false

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Продолжителность услуги',
		required: false,
	})
	readonly duration?: number = 0

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Необходимость услуги',
		required: false,
	})
	readonly isRequire?: boolean = false

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Порядок сортировки',
		required: false,
		default: 0,
	})
	readonly sortPosition?: number = 0

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'вкл/выкл видомости для пользователя',
		required: false,
	})
	readonly customerCanView?: boolean = false

	@IsArray()
	@IsOptional()
	@ApiProperty({
		description: 'Связь услуг',
		type: [ParentServiceDto],
		required: false,
	})
	parentServices?: ParentServiceDto[]
}

export class AdditionalEnableServicesDto {
	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'id сущность - только для обновления',
		required: false,
	})
	readonly id?: number

	@ApiProperty()
	@IsOptional()
	readonly isEnable?: boolean = false

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'id доп услуги',
	})
	readonly childrenId?: number
}

export class CompanyAddress {
	@IsInt()
	@ApiProperty({
		description: 'id связаного адреса',
		required: true,
	})
	readonly id: number
}

export class CreateServicesDto {
	@IsString()
	@ApiProperty({
		description: 'Заголовок',
		required: true,
	})
	title?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		description: 'Описание',
		required: false,
	})
	description?: string

	@IsOptional()
	@ApiProperty({
		description: 'Массив адресов компании',
		required: false,
		type: [CompanyAddress],
	})
	addresses?: CompanyAddress[]

	@IsEnum(EServiceTypes)
	@IsOptional()
	@ApiProperty({
		description: 'Тип: Аренда (стандартно)',
		required: false,
		enum: EServiceTypes,
		default: EServiceTypes.Rent,
	})
	type?: string = EServiceTypes.Rent

	@ApiProperty({ default: null })
	@IsNumber()
	price: number

	@ApiProperty({ enum: EAdditionalTypes, default: EAdditionalTypes.REQUISITE })
	@IsEnum(EAdditionalTypes)
	additionalType

	@ApiProperty({ enum: EPaymentTypes, default: null })
	@IsEnum(EPaymentTypes)
	paymentType

	@ApiProperty({ default: null })
	@IsNumber()
	paymentAmount

	@IsEnum(EServiceFormats)
	@IsOptional()
	@ApiProperty({
		description: 'Формат аренды',
		required: true,
		enum: EServiceFormats,
		default: EServiceFormats.Time,
	})
	format?: string = EServiceFormats.Time

	@IsNumber()
	@IsOptional()
	@ApiProperty({
		description: 'Мин. длительность сеанса',
		required: true,
	})
	minTimeLength: number
	@IsEnum(EBlockBookingType)
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	blockBookingType?: string = EBlockBookingType.MIN

	@IsNumber()
	@IsOptional()
	@ApiProperty({
		description: 'Длительность',
		required: false,
	})
	timeLength: number

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Перерыв между сеансами',
		required: false,
		default: 0,
	})
	break: number

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Блокировка онлайн-записи за N мин. до начала сеанса',
		required: false,
		default: false,
	})
	blockBookingIsEnable?: boolean = false

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Время блокировки записи для парамтера выше',
		required: false,
		default: 0,
	})
	blockBookingTime?: number = 0

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Вместимость',
		required: false,
		default: 1,
	})
	seats?: number = 1

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Минимальное число людей',
		required: false,
		default: 0,
	})
	amountPeopleMin?: number = 0

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Максиальное число людей',
		required: false,
		default: 0,
	})
	amountPeopleMax?: number = 0

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Количество мест, входящих в стоимость',
		required: false,
		default: 1,
	})
	includedSeats?: number = 1

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Дополнительные места on/off',
		required: false,
		default: false,
	})
	additionalSeatsIsEnable?: boolean = false

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Количество дополнительных мест (чел)',
		required: false,
		default: 0,
	})
	additionalSeats?: number = 0

	@IsOptional()
	@ApiProperty({
		description: 'Оплата за доп. места берется за',
		required: true,
	})
	additionalSeatsPaymentType: string

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Стоимость доп. места',
		required: true,
		default: 0,
	})
	additionalSeatsAmount?: number = 0

	@IsOptional()
	@ApiProperty({
		description: 'Список целей',
		required: false,
		default: [],
	})
	target?: any[] = []

	@IsEnum(EServicePrepayment)
	@IsOptional()
	@ApiProperty({
		description: 'Предоплата',
		required: false,
		default: EServicePrepayment.Main,
		enum: EServicePrepayment,
	})
	prepayment?: string = EServicePrepayment.Main

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Размер предоплаты',
		required: false,
		default: 50,
	})
	prepaymentAmount?: number = 50

	@IsOptional()
	@IsEnum(EServicePaymentTypes)
	@ApiProperty({
		description: 'Тип предоплаты %/сумма',
		required: false,
		enum: EServicePaymentTypes,
		default: EServicePaymentTypes.Amount,
	})
	prepaymentType: string = EServicePaymentTypes.Amount

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Отображать для клиентов',
		required: false,
	})
	customerCanView?: boolean = false

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Приоритет сортировки',
		required: false,
		default: 0,
	})
	sortPosition?: number = 0

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Активна услуга или нет',
		required: false,
		default: true,
	})
	isEnable?: boolean = true

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Активен перерыв или нет',
		required: false,
		default: false,
	})
	breakIsEnable?: boolean = false

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Обязательна услуга или нет',
		required: false,
		default: false,
	})
	isRequire?: boolean = false

	@IsInt()
	@ApiProperty({
		description: 'id компании к которой принадлежит услуга',
		required: true,
	})
	clientId: number

	@IsArray()
	@IsOptional()
	@ApiProperty({
		description: 'Связь с дополнительными услугами по id',
		type: [AdditionalServiceDto],
		required: false,
	})
	additionalServices?: AdditionalServiceDto[]

	@IsArray()
	@IsOptional()
	@ApiProperty({
		description: 'Настройки предоплаты',
		type: [ServicesPrepaymentsSettingsDto],
		required: false,
	})
	prepaymentParams?: ServicesPrepaymentsSettingsDto[]

	@IsArray()
	@IsOptional()
	@ApiProperty({
		description: 'Настройки оплаты',
		type: [CreateServicesPriceSettingDto],
		required: false,
	})
	priceSettings?: CreateServicesPriceSettingDto[]

	@IsArray()
	@IsOptional()
	@ApiProperty({
		description: 'Связь услуг',
		type: [ParentServiceDto],
		required: false,
	})
	parentServices: ParentServiceDto[]

	@IsInt()
	@IsOptional()
	@ApiProperty({
		default: 15,
		required: false,
	})
	duration: number

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		default: true,
		required: false,
	})
	isValid?: boolean = true

	additionalEnableServices?: AdditionalEnableServicesDto[]
}
