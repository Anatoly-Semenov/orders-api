import { CreateOrderDto, OrderAddressDto } from '../dto/create-order.dto'
import { UpdateOrderServiceDto } from '../dto/update-order-service.dto'

export interface MinimalOrder {
	orderServices?: UpdateOrderServiceDto[]
}
