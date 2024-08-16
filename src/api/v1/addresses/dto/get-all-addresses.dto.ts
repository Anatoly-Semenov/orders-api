import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class GetAllAddresseslDto {
	@IsInt()
	@ApiProperty()
	readonly appId: number
}
