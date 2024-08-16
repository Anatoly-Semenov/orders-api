import { ApiProperty } from '@nestjs/swagger'
import { EPaymentProvider } from '../../payments/enums/payments.enum'

export class CreateMerchantShopDto {
	@ApiProperty({
		description: 'id компании',
	})
	id: number

	@ApiProperty({
		enum: EPaymentProvider,
		default: EPaymentProvider.TINKOFF,
	})
	provider?: EPaymentProvider = EPaymentProvider.TINKOFF
}
