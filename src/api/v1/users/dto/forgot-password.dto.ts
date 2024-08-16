import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsUrl } from 'class-validator'

export class ForgotPasswordDto {
	@IsEmail()
	@ApiProperty()
	readonly userEmail: string

	@ApiProperty({
		description:
			'Ссылка будет добавлена в письмо. Внутри ссылки нужно добавить переменную :id - она будет заменена на hash id пользователя',
		example: 'https://example.com/forgot-password/:id?query-param=any',
		default: 'http://localhost:3000/user/activation/:id',
	})
	@IsUrl({
		require_protocol: true,
	})
	returnUrl?: string = 'http://localhost:3000/user/activation/:id'
}
