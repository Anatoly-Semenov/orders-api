import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsInt, IsString, IsBoolean } from 'class-validator'
import { FilterDto } from 'src/utils/filter/dto/filter.dto'

import { UsersRoles } from '../entities/users-roles.entity'
import { EUsersOrderFilds } from '../enums/user.enums'

export class FilterUsersDto extends FilterDto {
	@IsEnum(UsersRoles)
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: UsersRoles,
	})
	roles?: UsersRoles

	@IsInt()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	clientsId?: number

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	userEmail?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	services?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	firstname?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	lastname?: string

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
	workname?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	birthdate?: string

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	instagram?: string

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

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	street?: string

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		required: false,
	})
	userEnable?: boolean = true

	@IsEnum(EUsersOrderFilds)
	@IsOptional()
	@ApiProperty({
		required: false,
		enum: EUsersOrderFilds,
	})
	orderField?: EUsersOrderFilds = EUsersOrderFilds.UserId
}
