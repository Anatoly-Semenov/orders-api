import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetClientPaymentsSettingsDto {
	@IsInt()
	@ApiProperty()
	readonly paymentId: number
}
