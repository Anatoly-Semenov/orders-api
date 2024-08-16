import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { FilterDto } from 'src/utils/filter/dto/filter.dto'
import { EServicesCategoriesOrderFilds } from '../enums/services-categories.enum'

export class FilterServiceCategoryDto extends FilterDto {
	@IsString()
	@IsInt()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	id?: string | number

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	name?: string

	@IsEnum(EServicesCategoriesOrderFilds)
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: EServicesCategoriesOrderFilds,
	})
	orderField: EServicesCategoriesOrderFilds = EServicesCategoriesOrderFilds.Id
}
