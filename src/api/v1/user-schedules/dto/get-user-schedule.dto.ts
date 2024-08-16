import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetUserScheduleDto {
	@IsInt()
	@ApiProperty({
		description: 'User id',
		required: true,
	})
	userId: number

	@IsInt()
	@ApiProperty({
		description: 'Query limit',
		required: false,
		default: 10,
	})
	readonly limit?: number

	@IsInt()
	@ApiProperty({
		description: 'Query offset',
		required: false,
		default: 0,
	})
	readonly offset?: number
}
