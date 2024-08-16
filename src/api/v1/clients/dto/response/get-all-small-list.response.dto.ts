import { ApiProperty } from '@nestjs/swagger'

export class GetAllSmallListResponseDto {
	@ApiProperty()
	readonly id: number

	@ApiProperty()
	readonly clientName: string

	@ApiProperty()
	readonly isEnable: boolean
}
