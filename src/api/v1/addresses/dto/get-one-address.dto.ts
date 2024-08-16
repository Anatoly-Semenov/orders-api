import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetOneAddresseslDto {
	@IsInt()
	@ApiProperty()
	readonly id: number
}
