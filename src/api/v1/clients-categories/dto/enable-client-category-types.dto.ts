import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt } from 'class-validator'

export class EnableClientsCategoriesTypesDto {
	@IsInt()
	@ApiProperty()
	readonly id: number

	@IsBoolean()
	@ApiProperty({
		default: true,
	})
	readonly isEnable: boolean
}
