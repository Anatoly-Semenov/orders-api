import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetClientCustomersDto {
	@IsInt()
	@ApiProperty({
		description: 'App id',
	})
	appId: number
}
