import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class DeleteUserScheduleDto {
	@IsInt()
	@ApiProperty({
		description: 'Schedule id',
		required: true,
	})
	readonly id: number
}
