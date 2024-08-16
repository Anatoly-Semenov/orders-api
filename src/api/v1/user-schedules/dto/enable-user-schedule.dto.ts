import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt } from 'class-validator'

export class EnableUserScheduleDto {
	@IsInt()
	@ApiProperty({
		description: 'User id',
		required: true,
	})
	id: number

	@IsBoolean()
	@ApiProperty({
		default: true,
	})
	isEnable: boolean
}
