import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetAllClientsCategoriesTypeDto {
	@IsInt()
	@ApiProperty({
		description: "Array of categories id's",
		required: true,
		type: Number,
	})
	readonly catId: number
}
