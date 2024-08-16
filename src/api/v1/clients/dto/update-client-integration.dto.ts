import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateClientsIntegrationDto } from './create-client-integration.dto'

export class UpdateClientIntegrationDto extends CreateClientsIntegrationDto {
	@IsInt()
	@ApiProperty()
	readonly id: number
}
