import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetClientUsersDto {
	@IsInt()
	@ApiProperty()
	userId: number

	@IsInt()
	@ApiProperty({
		description: 'App id',
	})
	appId: number
}
