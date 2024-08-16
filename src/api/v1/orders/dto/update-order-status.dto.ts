import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { Statuses } from '../enums/orders.enums'

export class UpdateOrderStatusDto {
	@ApiProperty({
		required: true,
	})
	id: number

	@IsEnum(Statuses)
	@IsOptional()
	@ApiProperty({
		description: 'Order status',
		required: false,
		default: Statuses.Created,
		enum: Statuses,
	})
	status?: Statuses

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		required: true,
		default: false,
	})
	readonly isCompleted?: boolean = false
}
