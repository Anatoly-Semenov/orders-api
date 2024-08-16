import { ApiProperty } from '@nestjs/swagger'

export class TargetServiceResponseDto {
	@ApiProperty()
	readonly id: number
}
export class TargetResponseDto {
	@ApiProperty()
	readonly services: TargetServiceResponseDto

	@ApiProperty()
	readonly name: string

	@ApiProperty()
	readonly id: number

	@ApiProperty()
	readonly isDeleted: boolean
}
