import { ApiProperty, OmitType } from '@nestjs/swagger'
import { CreateOrderDto } from '../create-order.dto'
import { Users } from '../../../users/entities/users.entity'

export class FilteredOrderResponseDto extends OmitType(CreateOrderDto, ['clientId']) {
	@ApiProperty()
	id: number

	@ApiProperty()
	isTechnicalReservation: boolean

	@ApiProperty()
	user: Users
}
