import { ApiProperty } from '@nestjs/swagger'
import { CreateServicesDto } from '../create-services.dto'

export class ServiceResponseDto extends CreateServicesDto {
	@ApiProperty()
	readonly id: number
}
