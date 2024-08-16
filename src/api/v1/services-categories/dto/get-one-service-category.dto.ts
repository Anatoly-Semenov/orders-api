import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetOneServiceCategoryDto {
	@IsInt()
	@ApiProperty({
		description: 'Category id',
		required: true,
	})
	readonly categoryId: number
}
