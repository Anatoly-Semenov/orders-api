import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { Language } from '../../users/enums/user.enums'
import { CreateOrderCustomerMetaDto } from './create-order-customer-meta.dto'

export class CreateOrderCustomerDto {
	@IsString()
	@ApiProperty()
	@IsOptional()
	readonly userEmail

	@IsEnum(Language)
	@IsOptional()
	@ApiProperty({ default: Language.RU, required: false })
	readonly language: Language

	@IsString()
	@ApiProperty()
	readonly phone: string

	@IsString()
	@ApiProperty()
	readonly phoneIso: string

	@ApiProperty({ type: CreateOrderCustomerMetaDto })
	readonly meta: CreateOrderCustomerMetaDto
}
