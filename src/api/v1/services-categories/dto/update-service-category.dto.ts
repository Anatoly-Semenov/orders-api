import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateServiceCategoryDto } from './create-service-category.dto'

export class UpdateServiceCategoryDto extends CreateServiceCategoryDto {
	@IsInt()
	@ApiProperty({
		description: 'Category id',
		required: true,
	})
	readonly categoryId: number
}
