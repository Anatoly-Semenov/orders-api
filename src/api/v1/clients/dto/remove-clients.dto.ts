import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class RemoveClientsDto {
	@IsInt()
	@ApiProperty()
	appId: number

	@IsInt()
	@ApiProperty()
	userId: number
}
