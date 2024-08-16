import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsUrl, MaxLength } from 'class-validator'
import { CreateAddressDto } from '../../addresses/dto/create-address.dto'
import { UpdateAddressesDto } from '../../addresses/dto/update-address.dto'
import { AddUserInAppDto } from './add-user-in-app.dto'
import { CreateClientsMetaDto } from './client-meta.dto'

export class UpdateClientsDto {
	@IsInt()
	@ApiProperty({
		description: 'app id',
	})
	id: number

	@IsInt()
	@ApiProperty({
		description: 'How is update app id',
	})
	userId: number

	@ApiProperty({
		description: 'App name in system',
	})
	readonly clientName?: string

	@ApiProperty({
		description: 'Unique alias for this company',
	})
	readonly idAlias?: string

	@IsOptional()
	@ApiProperty({
		description: 'Payment link lifetime in seconds',
		default: 86400,
	})
	readonly paymentLinkSeconds?: number

	@IsOptional()
	@MaxLength(200)
	@ApiProperty({
		description: 'App description',
	})
	readonly clientDescription?: string

	@IsOptional()
	@ApiProperty({
		description: 'Timezone',
		default: 'Europe/Moscow',
	})
	readonly timezone?: string

	@IsOptional()
	@IsUrl()
	@ApiProperty({
		description: 'Unique url for app',
	})
	readonly clientUrl?: string

	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		description: 'Application active or not',
		default: false,
	})
	readonly isEnable?: boolean = false

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Application is test or not',
		default: false,
	})
	readonly isTest?: boolean = false

	@IsOptional()
	@ApiProperty({
		description: 'Application meta data',
		type: CreateClientsMetaDto,
	})
	meta?: CreateClientsMetaDto

	@IsOptional()
	@ApiProperty({
		description: 'Add users in app',
		type: [AddUserInAppDto],
	})
	users?: AddUserInAppDto[]

	@IsOptional()
	@IsOptional()
	@ApiProperty({
		description: 'Logo file url',
		required: false,
		default: '',
	})
	logoUrl?: string

	@IsOptional()
	@ApiProperty({
		description: 'Application addresses array',
		type: [CreateAddressDto],
		required: false,
	})
	addresses?: UpdateAddressesDto[]

	@ApiProperty({ default: [], description: 'Array of files entity' })
	@IsArray()
	@IsOptional()
	files?: any[] = []
}
