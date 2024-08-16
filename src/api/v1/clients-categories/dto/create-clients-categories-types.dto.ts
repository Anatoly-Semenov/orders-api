import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsIn, IsInt, IsString, MaxLength } from 'class-validator'

export class CreateClientsCategoriesTypesDto {
	@IsString()
	@ApiProperty({
		required: true,
		example: 'Фотостудия',
	})
	readonly name: string

	@IsString()
	@MaxLength(200)
	@ApiProperty({
		required: true,
		maxLength: 200,
		example: 'Подкатегория - фотостудия',
	})
	readonly description: string

	@IsInt()
	@ApiProperty({
		description: 'ID родительской категории',
		required: true,
		example: 1,
	})
	readonly catId: number

	@IsBoolean()
	@ApiProperty({
		default: true,
		required: false,
	})
	readonly isEnable?: boolean = true
}
