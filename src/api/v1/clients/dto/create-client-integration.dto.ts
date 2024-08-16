import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { EClientIntegrationKeys } from '../enums/client.enums'

export class CreateClientsIntegrationDto {
	@ApiProperty({
		enum: EClientIntegrationKeys,
	})
	@IsEnum(EClientIntegrationKeys)
	key: EClientIntegrationKeys

	@ApiProperty({
		default: {},
	})
	value: any

	@ApiProperty({
		default: 1,
	})
	clientId: number
}
