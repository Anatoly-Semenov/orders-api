import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class CloneAddressDto {
	@IsInt()
	@ApiProperty()
	readonly id: number
}
