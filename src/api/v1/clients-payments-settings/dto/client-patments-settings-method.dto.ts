import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { ClientPaymentsSettingsMetaDto } from './client-patments-settings-meta.dto'

export class ClientPaymentsSettingsMethodsDto {
	@IsInt()
	@ApiProperty()
	readonly id?: number

	@ApiProperty({
		description: 'Payment method name',
	})
	readonly name: string

	@ApiProperty({
		description: 'Payment meta datas',
		type: [ClientPaymentsSettingsMetaDto],
		required: false,
	})
	readonly meta?: ClientPaymentsSettingsMetaDto[]
}
