import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { ETinkoffTax, ETinkoffTaxation } from '../../payments/enums/tinkoff/tinkoff.enum'

type TClientPhone = {
	number: string
	iso: string
}
export class TinkoffPaymentDataDto {
	Ean13: string
	Tax: ETinkoffTax
	Taxation: ETinkoffTaxation
	TerminalKey: string
}

export class CreateClientsMetaDto {
	@ApiProperty()
	@IsPhoneNumber()
	readonly phone?: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly phoneIso?: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly category?: string

	@ApiProperty()
	@IsEmail()
	@IsOptional()
	readonly email?: string

	@IsOptional()
	@ApiProperty({
		type: TinkoffPaymentDataDto,
	})
	readonly tinkoffPaymentData?: TinkoffPaymentDataDto
}
