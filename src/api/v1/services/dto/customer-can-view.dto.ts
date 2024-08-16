import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class CustomerCanViewDto {
	@IsBoolean()
	@ApiProperty({
		default: false,
	})
	customerCanView: boolean
}
