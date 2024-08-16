import { ApiProperty } from '@nestjs/swagger'

export class TokenDto {
	@ApiProperty()
	readonly userId: number
	@ApiProperty()
	readonly refreshToken: string
}
