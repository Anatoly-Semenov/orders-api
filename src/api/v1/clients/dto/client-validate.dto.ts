import { ApiProperty } from '@nestjs/swagger'

export class ClientValidateDto {
	@ApiProperty()
	readonly username: number

	@ApiProperty()
	readonly password: string
}
