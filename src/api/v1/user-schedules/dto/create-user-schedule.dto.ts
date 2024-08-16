import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt } from 'class-validator'

export class CreateUserScheduleDto {
	@IsDate()
	@ApiProperty({
		description: 'Date and time user start work',
		required: true,
	})
	readonly dateTimeStart: string

	@IsDate()
	@ApiProperty({
		description: 'Date and time user end work',
		required: true,
	})
	readonly dateTimeEnd: string

	@ApiProperty({
		description: 'Working timezone',
		default: 'Europe/Moscow',
		required: false,
	})
	readonly timezone?: string

	@IsInt()
	@ApiProperty({
		description: 'User id',
		required: true,
	})
	readonly userId: number
}
