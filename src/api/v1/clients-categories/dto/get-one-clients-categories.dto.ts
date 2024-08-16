import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetOneClientsCategoriesDto {
	@IsInt()
	@ApiProperty({
		required: true,
	})
	readonly id: number
}
