import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsObject, IsOptional } from 'class-validator'

export class OrderPaymentDto {
	@IsInt()
	@ApiProperty({
		description: 'Order id',
		required: true,
	})
	InvoiceId: number

	@IsOptional()
	@IsObject()
	@ApiProperty({
		description: 'Other order data',
		required: false,
	})
	JsonData?: any
}
