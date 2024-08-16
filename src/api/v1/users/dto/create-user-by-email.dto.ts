import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsInt, IsString } from 'class-validator'
import { Language } from '../enums/user.enums'
import { CreateUserMetaDto } from './user-meta.dto'

export class CreateUserByEmailDto {
	@IsString()
	@ApiProperty()
	userEmail: string

	@IsString()
	@ApiProperty()
	userPassword: string

	@IsArray()
	@ApiProperty({
		type: CreateUserMetaDto,
		required: false,
	})
	meta?: CreateUserMetaDto

	@ApiProperty()
	@IsString()
	returnUrl: string

	@ApiProperty()
	@IsString()
	phone: string

	@ApiProperty()
	@IsString()
	phoneIso: string

	@IsEnum(Language)
	@ApiProperty({
		required: false,
		enum: Language,
		default: Language.RU,
	})
	language?: Language

	@IsInt()
	@ApiProperty({
		description: 'Role ids',
		required: false,
		type: [Number],
	})
	roles?: number[]

	@IsArray()
	@ApiProperty({
		description: 'Array of address id relations',
		required: false,
		default: [],
		type: [Number],
	})
	addresses?: number[]

	clients?: any[]
}
