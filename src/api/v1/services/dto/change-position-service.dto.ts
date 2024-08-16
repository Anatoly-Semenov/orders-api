import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class ChangePositionServiceDto {
	@IsInt()
	@ApiProperty()
	readonly id: number

	@IsInt()
	@ApiProperty({
		default: 0,
		description: 'Позиция в списке',
	})
	readonly sortPosition: number
}
