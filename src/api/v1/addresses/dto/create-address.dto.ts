import { ApiProperty } from '@nestjs/swagger'
import {
	IsInt,
	IsISO31661Alpha3,
	IsLatitude,
	IsLongitude,
	IsOptional,
	IsPostalCode,
} from 'class-validator'
import { CreateAddressWorkingTimeDto } from './create-address-working-time.dto'

export class CreateAddressDto {
	@ApiProperty()
	readonly country: string

	@IsISO31661Alpha3()
	@ApiProperty()
	readonly countryIsoCode: string

	@IsPostalCode()
	@ApiProperty({
		required: false,
	})
	readonly postalCode?: string

	@ApiProperty({
		required: false,
	})
	readonly house?: number

	@ApiProperty({
		required: false,
	})
	readonly block?: string

	@ApiProperty({
		required: false,
	})
	readonly floor?: number

	@ApiProperty({
		required: false,
	})
	readonly office?: string

	@IsLatitude()
	@ApiProperty({
		required: false,
	})
	readonly geoLat?: number

	@IsLongitude()
	@ApiProperty({
		required: false,
	})
	readonly geoLon?: number

	@ApiProperty()
	readonly city: string

	@ApiProperty({
		required: false,
	})
	readonly street?: string

	@ApiProperty({
		required: false,
		default: true,
	})
	readonly isActive?: boolean

	@ApiProperty({
		required: true,
		description: 'id компании к которой принадлежит адрес',
	})
	readonly appId?: number

	@ApiProperty({
		required: false,
		description: 'Позиция элемента для сортировки',
	})
	@IsOptional()
	readonly sortPosition?: number

	@ApiProperty({
		description: 'Working time list',
		type: [CreateAddressWorkingTimeDto],
	})
	workingTime: CreateAddressWorkingTimeDto[]

	@IsOptional()
	files?: any[]
}
