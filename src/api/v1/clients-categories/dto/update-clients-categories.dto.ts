import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString } from 'class-validator'
import { CreateClientsCategoriesDto } from './create-clients-categories.dto'
import { UpdateClientsCategoriesTypesDto } from './update-clients-categoires-types.dto'

export class UpdateClientsCategoriesDto extends CreateClientsCategoriesDto {
	@IsInt()
	@ApiProperty({
		required: true,
	})
	readonly id: number

	@ApiProperty({
		required: false,
		type: [UpdateClientsCategoriesTypesDto],
	})
	readonly types?: UpdateClientsCategoriesTypesDto[]
}
