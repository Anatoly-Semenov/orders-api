import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { Currency } from 'src/api/v1/payments/enums/payments.enum'

export class CreateRecurrentDto {
	@ApiProperty({
		description: 'Client id',
	})
	appId: number
	@ApiProperty({
		description: 'Rate id',
	})
	rateId: number

	@ApiProperty({
		description: 'Card Token',
	})
	@IsString()
	token: string

	@ApiProperty({
		description: 'Payment currency',
		required: false,
	})
	@IsOptional()
	currency?: Currency = Currency.RUB
}
