import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt } from 'class-validator'
import { ClientPaymentsSettingsMeta } from '../enums/client-payments-settings-meta.emum'

export class ClientPaymentsSettingsMetaDto {
	@IsInt()
	@ApiProperty()
	readonly id?: number

	@ApiProperty({
		description: 'Parent payment method name',
	})
	readonly methodName: string

	@IsEnum(ClientPaymentsSettingsMeta)
	@ApiProperty({
		description: 'key of meta',
		enum: ClientPaymentsSettingsMeta,
	})
	readonly key: ClientPaymentsSettingsMeta

	@ApiProperty({
		description: 'value of meta',
	})
	readonly value: string
}
