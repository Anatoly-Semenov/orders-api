import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateOrderCustomerMetaDto } from './create-order-customer-meta.dto'

export class UpdateOrderCustomerMetaDto extends PartialType(CreateOrderCustomerMetaDto) {
	@IsInt()
	@ApiProperty()
	readonly id: number
}
