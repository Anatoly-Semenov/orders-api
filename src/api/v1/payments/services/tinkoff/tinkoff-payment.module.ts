import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { TinkoffPaymentService } from './tinkoff-payment.service'

@Module({
	imports: [HttpModule],
	providers: [TinkoffPaymentService],
	exports: [TinkoffPaymentModule, TinkoffPaymentService],
})
export class TinkoffPaymentModule {}
