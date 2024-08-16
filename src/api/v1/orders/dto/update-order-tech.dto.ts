import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateOrderTechDto } from './create-order-tech.dto'

export class UpdateOrderTechDto extends PartialType(CreateOrderTechDto) {
	@ApiProperty()
	@IsInt()
	readonly id: number
}
