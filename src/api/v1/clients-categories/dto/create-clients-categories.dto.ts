import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString, MaxLength } from 'class-validator'
import { CreateClientsCategoriesTypesDto } from './create-clients-categories-types.dto'

export class CreateClientsCategoriesDto {
	@IsString()
	@ApiProperty({
		required: true,
		example: 'Аренда',
	})
	readonly name: string

	@IsString()
	@MaxLength(200)
	@ApiProperty({
		required: true,
		maxLength: 200,
		example: 'Категория для тех кто сдает помещения в аренду',
	})
	readonly description: string

	@ApiProperty({
		required: false,
		type: [CreateClientsCategoriesTypesDto],
	})
	readonly types?: CreateClientsCategoriesTypesDto[]

	@IsBoolean()
	@ApiProperty({
		default: true,
		required: false,
	})
	readonly isEnable?: boolean = true
}
