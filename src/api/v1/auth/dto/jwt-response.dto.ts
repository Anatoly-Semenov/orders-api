import { ApiProperty } from '@nestjs/swagger'
import { IsJWT, IsString } from 'class-validator'

export class JwtResponseDto {
	@IsString()
	@IsJWT()
	@ApiProperty({
		description: 'Токен авторизации',
	})
	readonly accessToken: string

	@IsString()
	@IsJWT()
	@ApiProperty({
		description: 'Токен авторизации',
	})
	readonly refreshToken: string

	@IsString()
	@ApiProperty({
		description: 'Дата уничтожения access токена',
	})
	readonly expireDateAccessToken: string

	@IsString()
	@ApiProperty({
		description: 'Дата уничтожения refresh токена',
	})
	readonly expireDateRefreshToken: string
}
