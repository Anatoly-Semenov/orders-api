import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsMilitaryTime } from 'class-validator'
import { Days } from '../enums/client.enums'

export class CreateClientAddressesWorkingTimeDto {
	@IsEnum(Days)
	@ApiProperty({
		enum: Days,
	})
	readonly day: Days

	@IsMilitaryTime()
	@ApiProperty({
		description: 'Time working start',
	})
	readonly timeStart: string

	@IsMilitaryTime()
	@ApiProperty({
		description: 'Time working end',
	})
	readonly timeEnd: string
}
