import { ApiProperty } from '@nestjs/swagger'
import { CreateUserMetaDto } from './user-meta.dto'
import { IsArray, IsBoolean, IsEmail, IsEnum, IsInt } from 'class-validator'
import { Language } from '../enums/user.enums'

export class UpdateUserByHashDto {
	@IsEmail()
	@ApiProperty({
		required: false,
	})
	readonly userEmail?: string

	@ApiProperty({
		required: false,
	})
	userPassword?: string

	@IsEnum(Language)
	@ApiProperty({
		required: false,
		enum: Language,
	})
	language: Language

	@IsBoolean()
	@ApiProperty({
		required: false,
	})
	isActive?: boolean

	@IsArray()
	@ApiProperty({
		type: CreateUserMetaDto,
		required: false,
	})
	meta?: CreateUserMetaDto

	@IsInt()
	@ApiProperty({
		description: 'Role ids',
		required: false,
		type: [Number],
	})
	readonly roles?: number[]

	@IsArray()
	@ApiProperty({
		description: 'Array of address id relations',
		required: false,
		default: [],
		type: [Number],
	})
	readonly addresses?: number[]
}
