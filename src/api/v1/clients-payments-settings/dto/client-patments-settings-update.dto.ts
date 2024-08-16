import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { ClientPaymentsSettingsDto } from './client-patments-settings.dto'

export class UpadteClientPaymentsSettingsDto extends ClientPaymentsSettingsDto {
	@IsInt()
	@ApiProperty()
	readonly paymentId: number
}
