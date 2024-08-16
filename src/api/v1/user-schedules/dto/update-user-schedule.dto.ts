import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateUserScheduleDto } from './create-user-schedule.dto'

export class UpdateUserScheduleDto extends CreateUserScheduleDto {
	@IsInt()
	@ApiProperty({
		description: 'Schedule id',
		required: true,
	})
	readonly id: number

	@IsInt()
	@ApiProperty({
		description: 'User id',
		required: true,
	})
	userId: number
}
