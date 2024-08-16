import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateClientAddressesWorkingTimeDto } from './create-client-address-working-time.dto'

export class UpdateClientAddressesWorkingTimeDto extends CreateClientAddressesWorkingTimeDto {
	@IsInt()
	@ApiProperty()
	readonly id: number
}
