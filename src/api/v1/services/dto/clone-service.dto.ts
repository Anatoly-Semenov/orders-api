import { ApiProperty } from '@nestjs/swagger'

export class CloneServiceDto {
	@ApiProperty()
	readonly id: number
}
