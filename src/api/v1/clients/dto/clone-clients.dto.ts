import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class CloneClientsDto {
	@IsInt()
	@ApiProperty({
		description: 'Creater id',
	})
	userId: number

	@IsInt()
	@ApiProperty({
		description: 'App id',
	})
	appId: number
}
