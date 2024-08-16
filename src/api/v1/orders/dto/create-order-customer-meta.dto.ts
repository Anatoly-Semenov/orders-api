import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { ECustomerSocials } from '../enums/customer.enums'

export class CustomerSocials {
	@ApiProperty({ enum: ECustomerSocials, default: ECustomerSocials.INSTAGRAM })
	key: ECustomerSocials
	@ApiProperty()
	value: any
}
export class CreateOrderCustomerMetaDto {
	@IsString()
	@ApiProperty()
	@IsOptional()
	readonly firstName?: string

	@IsString()
	@ApiProperty()
	@IsOptional()
	readonly lastName?: string

	@ApiProperty({
		type: [CustomerSocials],
		required: false,
	})
	@IsOptional()
	readonly socials?: CustomerSocials[]
}
