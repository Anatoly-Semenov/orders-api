import { ApiProperty } from '@nestjs/swagger'
import { EPaymentProvider } from '../../enums/payments.enum'
import { ETinkoffAddresses } from '../../enums/tinkoff/tinkoff.enum'

export class CreateMerchantShopInTinkoffAddressesDto {
	@ApiProperty({ enum: ETinkoffAddresses })
	type: ETinkoffAddresses

	@ApiProperty()
	zip: string

	@ApiProperty()
	country: string

	@ApiProperty()
	city: string

	@ApiProperty()
	street: string
}
export class CreateMerchantShopInTinkoffCEODto {
	@ApiProperty()
	firstName: string

	@ApiProperty()
	lastName: string

	@ApiProperty()
	middleName: string

	@ApiProperty()
	birthDate: string

	@ApiProperty()
	phone: string

	@ApiProperty()
	country: string
}
export class CreateMerchantShopInTinkoffBankAccountDto {
	account: string
	bankName: string
	bik: string
	details: string
	tax: number
}
export class CreateMerchantShopInTinkoffDto {
	@ApiProperty()
	clientId: number

	@ApiProperty()
	billingDescriptor: string

	@ApiProperty()
	fullName: string

	@ApiProperty()
	name: string

	@ApiProperty()
	inn: string

	@ApiProperty()
	kpp: string

	@ApiProperty({
		type: [CreateMerchantShopInTinkoffAddressesDto],
	})
	addresses: CreateMerchantShopInTinkoffAddressesDto[]

	@ApiProperty()
	email: string

	@ApiProperty()
	siteUrl: string

	@ApiProperty({
		type: CreateMerchantShopInTinkoffCEODto,
	})
	ceo: CreateMerchantShopInTinkoffCEODto

	@ApiProperty({
		type: CreateMerchantShopInTinkoffBankAccountDto,
	})
	bankAccount: CreateMerchantShopInTinkoffBankAccountDto

	client: any

	@ApiProperty({
		enum: EPaymentProvider,
	})
	provider: EPaymentProvider
}
