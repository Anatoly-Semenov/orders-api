import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'
import { FilterDto } from 'src/utils/filter/dto/filter.dto'

export class FilterClientsDto extends FilterDto {
	@IsInt()
	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	id?: string | number

	@IsInt()
	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	rateId?: string | number

	@IsInt()
	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	serviceId?: string | number

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	clientName?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	clientUrl?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	countryIsoCode?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	city?: string

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	isEnable?: boolean

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	phone?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	email?: string
}
