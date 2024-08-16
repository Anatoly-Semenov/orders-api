import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateAddressDto } from './create-address.dto'
import { UpdateAddressesWorkingTimeDto } from './update-address-working-time.dto'

export class UpdateAddressesDto extends CreateAddressDto {
	@ApiProperty({
		description: 'Working time list',
		type: [UpdateAddressesWorkingTimeDto],
	})
	readonly workingTime: UpdateAddressesWorkingTimeDto[]

	readonly id: number
}
