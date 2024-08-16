import { PartialType } from '@nestjs/swagger'
import { CreateOrderDto, OrderAddressDto } from './create-order.dto'
import { UpdateOrderCustomerDto } from './update-order-customer.dto'
import { UpdateOrderServiceDto } from './update-order-service.dto'

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
	readonly id: number
	readonly customer?: UpdateOrderCustomerDto
	orderServices?: UpdateOrderServiceDto[]
	address?: OrderAddressDto
}
