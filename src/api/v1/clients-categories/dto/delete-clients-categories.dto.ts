import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class DeleteClientsCategoriesDto {
	@IsInt()
	@ApiProperty({
		required: true,
	})
	readonly id: number
}
