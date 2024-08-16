import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateOrderCustomerDto } from './create-order-customer.dto'
import { UpdateOrderCustomerMetaDto } from './update-order-customer-meta.dto'

export class UpdateOrderCustomerDto extends CreateOrderCustomerDto {
	@ApiProperty()
	@IsInt()
	readonly id: number

	@ApiProperty({ type: UpdateOrderCustomerMetaDto })
	readonly meta: UpdateOrderCustomerMetaDto
}
