import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt } from 'class-validator'

export class EnableClientsCategoriesDto {
	@IsInt()
	@ApiProperty()
	readonly id: number

	@IsBoolean()
	@ApiProperty({
		default: true,
	})
	readonly isEnable: boolean
}