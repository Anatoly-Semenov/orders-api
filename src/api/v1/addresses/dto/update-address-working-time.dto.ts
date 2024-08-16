import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateAddressWorkingTimeDto } from './create-address-working-time.dto'

export class UpdateAddressesWorkingTimeDto extends CreateAddressWorkingTimeDto {
	@IsInt()
	@ApiProperty()
	readonly id: number
}
