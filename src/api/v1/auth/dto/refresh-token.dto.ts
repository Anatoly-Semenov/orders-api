import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenDto {
	@ApiProperty()
	@Type(() => String)
	refreshToken: string
}
