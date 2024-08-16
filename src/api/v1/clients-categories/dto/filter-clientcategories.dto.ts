import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { FilterDto } from 'src/utils/filter/dto/filter.dto'

export class FilterClientsCategoriesDto extends FilterDto {
	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	name?: string | number

	@IsInt()
	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	id?: string | number
}

export class FilterClientsTypesDto extends FilterClientsCategoriesDto {
	@IsInt()
	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	categoryId?: string | number
}
