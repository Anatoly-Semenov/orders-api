import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsIn, IsInt } from 'class-validator'
import { ClientPaymentsSettingsMethodsDto } from './client-patments-settings-method.dto'

export class ClientPaymentsSettingsDto {
	@IsInt()
	@ApiProperty({
		description: 'Creator id',
	})
	userId: number

	@IsInt()
	@ApiProperty({
		description: 'Client app id',
	})
	appId: number

	@IsInt()
	@ApiProperty({
		description: 'Payment expiration date (min)',
	})
	readonly expire: number

	@IsBoolean()
	@ApiProperty({
		description: 'Tax accounting',
		default: false,
	})
	readonly taxAccount: boolean = false

	@IsIn(['RUB', 'EUR', 'USD'])
	@ApiProperty({
		description: 'Company currency',
		default: 'RUB',
		enum: ['RUB', 'EUR', 'USD'],
	})
	readonly currency: string

	@ApiProperty({
		description: 'Payments method list',
		type: [ClientPaymentsSettingsMethodsDto],
	})
	readonly methods: ClientPaymentsSettingsMethodsDto[]
}
