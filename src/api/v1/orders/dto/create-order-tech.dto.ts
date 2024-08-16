import { PickType } from '@nestjs/swagger'
import { CreateOrderDto } from './create-order.dto'

export class CreateOrderTechDto extends PickType(CreateOrderDto, [
	'orderServices',
	'address',
	'comment',
	'dateTimeStart',
	'dateTimeEnd',
	'clientId',
	'id',
	'datetimezone',
]) {
	isTechnicalReservation: boolean
}
