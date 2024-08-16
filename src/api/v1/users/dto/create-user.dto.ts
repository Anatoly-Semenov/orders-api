import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsOptional, IsString, IsUrl } from 'class-validator'
import { Files } from '../../files/entity/files.entity'
import { CreateUserMetaDto } from './user-meta.dto'

export class CreateUserDto {
	@IsEmail()
	@ApiProperty()
	readonly userEmail: string
	@ApiProperty({
		description:
			'Пароль пользователя - необязателен. Если не указан, папроль будет создан автоматически и выслан на почту',
		required: false,
	})
	userPassword?: string

	@ApiProperty({ type: CreateUserMetaDto, required: false })
	@IsOptional()
	readonly meta?: CreateUserMetaDto

	@IsString()
	@ApiProperty()
	phone?: string

	@ApiProperty()
	@IsString()
	phoneIso?: string

	@IsArray()
	@ApiProperty()
	files?: Files[]

	@IsArray()
	@ApiProperty({ description: 'Role id', type: [Number], default: [1] })
	roles?: number[]

	@IsOptional()
	@IsArray()
	@ApiProperty({
		description: 'Array of address id relations',
		required: false,
		type: [Number],
		default: [],
	})
	readonly addresses?: number[]

	@IsOptional()
	@IsArray()
	@ApiProperty({
		description: 'Array of photos links',
		required: false,
		type: [String],
		default: [],
	})
	photos: string[]

	@ApiProperty({
		description:
			'Ссылка будет добавлена в письмо. Внутри ссылки нужно добавить переменную :id - она будет заменена на hash id пользователя',
		example: 'https://example.com/user-enable/:id?query-param=any',
		default: 'http://localhost:3000/user/activation/:id',
	})
	@IsUrl({
		require_protocol: true,
	})
	returnUrl?: string = 'http://localhost:3000/user/activation/:id'

	clients?: any[]
}
