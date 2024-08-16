import { ApiProperty } from '@nestjs/swagger'
import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsInt,
	IsJSON,
	IsObject,
	IsOptional,
	IsUrl,
	MaxLength,
} from 'class-validator'
import { CreateUserDto } from '../../users/dto/create-user.dto'

import { CreateClientsMetaDto } from './client-meta.dto'
import { CreateAddressDto } from '../../addresses/dto/create-address.dto'

export class CreateClientDto {
	@IsInt()
	readonly userId: number

	@IsEmail()
	readonly userEmail: string

	@ApiProperty({
		description: 'App name in system',
	})
	readonly clientName: string

	@ApiProperty({
		description: 'Unique alias for this company',
	})
	readonly idAlias: string

	@IsOptional()
	@MaxLength(200)
	@ApiProperty({
		description: 'App description',
		required: false,
	})
	readonly clientDescription?: string

	@IsUrl()
	@ApiProperty({
		description: 'Unique url for app',
	})
	readonly clientUrl: string

	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		description: 'Application active or not',
		default: true,
		required: false,
	})
	readonly isEnable?: boolean = true

	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		description: 'Application is test or not',
		default: false,
		required: false,
	})
	readonly isTest?: boolean = false

	@IsOptional()
	@ApiProperty({
		description: 'Timezone',
		default: 'Europe/Moscow',
		required: false,
	})
	readonly timezone?: string

	@ApiProperty({
		description: 'Application meta data',
		type: CreateClientsMetaDto,
		required: false,
	})
	@IsOptional()
	meta?: CreateClientsMetaDto

	@IsOptional()
	@ApiProperty({
		description: 'Application addresses array',
		type: [CreateAddressDto],
		required: false,
	})
	addresses?: CreateAddressDto[]

	@IsOptional()
	@ApiProperty({
		description: 'Users list',
		type: [CreateUserDto],
		required: false,
	})
	users?: CreateUserDto[]

	@IsOptional()
	@ApiProperty({
		description: 'Array of services',
		required: false,
	})
	services?: any[]

	@IsInt()
	@IsOptional()
	@ApiProperty({
		description: 'Шаг времени в календаре',
		default: 60,
		required: false,
	})
	calendarTimeStep?: number

	@IsOptional()
	@ApiProperty({
		description: 'Payment link lifetime in seconds',
		default: 86400,
	})
	readonly paymentLinkSeconds?: number
}
