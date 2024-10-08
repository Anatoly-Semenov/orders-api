import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetAllClientPaymentsSettingsDto {
	@IsInt()
	@ApiProperty()
	readonly appId: number
}
