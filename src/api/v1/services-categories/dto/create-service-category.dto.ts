import { ApiProperty } from '@nestjs/swagger'

export class CreateServiceCategoryDto {
	@ApiProperty({
		description: 'Category name',
		required: true,
	})
	readonly name: string
}
