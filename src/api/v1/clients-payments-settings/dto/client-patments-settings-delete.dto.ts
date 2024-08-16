import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class DeleteClientPaymentsSettingsDto {
	@IsInt()
	@ApiProperty()
	readonly paymentId?: number
}
