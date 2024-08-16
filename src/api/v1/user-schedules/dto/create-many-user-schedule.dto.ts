import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'
import { CreateUserScheduleDto } from './create-user-schedule.dto'

export class CreateManyUserScheduleDto {
	@IsArray()
	@ApiProperty({
		description: 'Schedule items array',
		required: true,
		type: [CreateUserScheduleDto],
	})
	readonly items: CreateUserScheduleDto[]
}
