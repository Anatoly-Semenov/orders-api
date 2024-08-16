import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetOneClientsCategoriesTypeDto {
	@IsInt()
	@ApiProperty({
		required: true,
	})
	readonly id: number
}
