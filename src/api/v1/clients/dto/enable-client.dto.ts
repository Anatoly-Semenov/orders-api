import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt } from 'class-validator'

export class EnableClientsDto {
	@IsInt()
	@ApiProperty()
	id: number

	@IsBoolean()
	@ApiProperty({
		default: true,
	})
	idEnable: boolean
}
