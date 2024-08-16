import { ApiProperty } from '@nestjs/swagger'

export class AuthUsersDto {
	@ApiProperty()
	readonly userEmail: string
	@ApiProperty()
	readonly userPassword: string
}
