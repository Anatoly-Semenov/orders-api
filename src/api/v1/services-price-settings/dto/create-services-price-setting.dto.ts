import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator'
import { CreateServicesPriceSettingParamsDto } from './create-services-price-setting-params.dto'
export class ServicePriceSettingsRelation {
	@IsInt()
	@ApiProperty()
	readonly id: number
}
export class CreateServicesPriceSettingDto {
	@IsString()
	@IsOptional()
	@ApiProperty()
	readonly action?: string

	@IsArray()
	@IsOptional()
	@ApiProperty({
		description: 'Параметры настроки',
		required: false,
		type: [CreateServicesPriceSettingParamsDto],
	})
	readonly parameters?: CreateServicesPriceSettingParamsDto[]

	@IsInt()
	@ApiProperty({
		description: 'id услуги к которой принадлежит настройка цены',
	})
	readonly serviceId: number

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		default: false,
		required: false,
	})
	readonly unimportantTarget?: boolean = false

	@IsDateString()
	@IsOptional()
	@ApiProperty({
		description: 'Дата начала действия параметра',
		nullable: true,
		default: new Date(),
	})
	dateStart?: string

	@IsDateString()
	@IsOptional()
	@ApiProperty({
		description: 'Дата окончания действия параметра',
		nullable: true,
		default: new Date(),
		required: false,
	})
	dateEnd?: string

	@IsOptional()
	@ApiProperty({
		type: ServicePriceSettingsRelation,
		required: false,
	})
	traget?: ServicePriceSettingsRelation
}
