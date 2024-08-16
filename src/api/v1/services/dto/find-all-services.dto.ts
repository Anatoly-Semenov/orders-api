import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'
import { EServiceTypes } from '../enums/service.enum'
import { defaultLimit, defaultOffset } from '../constants'

export class FindAllServicesDto {
	@IsArray()
	@IsOptional()
	@ApiProperty({
		default: EServiceTypes.Rent,
		required: false,
		enum: EServiceTypes,
		type: [String],
	})
	type?: string[] = [EServiceTypes.Rent]

	@IsArray()
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: EServiceTypes,
		type: [String],
	})
	readonly exclude?: string[]

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		default: 'false',
	})
	readonly isDeleted?: string = 'false'

	@IsInt()
	@IsOptional()
	@ApiProperty({ required: false, default: defaultOffset })
	readonly offset?: number

	@IsInt()
	@IsOptional()
	@ApiProperty({ required: false, default: defaultLimit })
	readonly limit?: number
}
