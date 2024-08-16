import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt } from 'class-validator'

export class EnableUserDto {
	@IsInt()
	@ApiProperty()
	id: number

	@IsBoolean()
	@ApiProperty({
		default: true,
	})
	isEnable: boolean
}
