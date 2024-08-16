import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetAllOrdersDto {
	@IsInt()
	@IsInt()
	@ApiProperty({
		description: 'user id',
	})
	userId: number
}
