import { ApiProperty } from '@nestjs/swagger'
import { EServiceTypes } from '../../enums/service.enum'

export class ServicesSmallListDto {
	@ApiProperty()
	readonly id: number

	@ApiProperty()
	readonly sortPosition: number

	@ApiProperty()
	readonly isEnable: boolean

	@ApiProperty()
	readonly title: string

	@ApiProperty({
		enum: EServiceTypes,
	})
	readonly type: EServiceTypes
}
