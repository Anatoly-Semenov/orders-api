import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

import { CreateOrderAdditionalServiceDto, CreateOrderServiceDto } from './create-order-service.dto'

export class UpdateOrderAdditionalServiceDto extends CreateOrderAdditionalServiceDto {
	@ApiProperty()
	@IsInt()
	readonly id: number
}
export class UpdateOrderServiceDto extends CreateOrderServiceDto {
	@ApiProperty()
	@IsInt()
	readonly id: number
}
