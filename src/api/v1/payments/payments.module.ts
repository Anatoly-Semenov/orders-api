import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Clients } from '../clients/entities/clients.entity'
import { RatesModule } from '../rates/rates.module'
import { UsersCardsModule } from 'src/api/v1/users-cards/users-cards.module'

import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { Orders } from '../orders/entities/orders.entity'
import { Payments } from './entities/payment.entity'
import { TinkoffPaymentModule } from './services/tinkoff/tinkoff-payment.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { BullModule } from '@nestjs/bull'
import { PaymentsProcessor } from './payments.processor'
import { OrdersModule } from '../orders/orders.module'
import { NotificationsModule } from 'src/utils/notifications/notifications.module'
import { Config } from 'src/config/main.config'

@Module({
	imports: [
		TypeOrmModule.forFeature([Clients, Orders, Payments]),
		BullModule.registerQueue({
			name: 'payments',
		}),
		forwardRef(() => OrdersModule),
		TinkoffPaymentModule,
		NotificationsModule,
		RatesModule,
		UsersCardsModule,
		ConfigModule,
	],
	controllers: [PaymentsController],
	providers: [
		PaymentsService,
		PaymentsProcessor,
		{
			provide: 'PAYMENTS_MICROSERVICE',
			useFactory: (configService: ConfigService) => {
				return ClientProxyFactory.create({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get<string>(Config.RABBIT_MQ_URL)],
						queue: 'payments_queue',
						queueOptions: {
							durable: false,
						},
					},
				})
			},
			inject: [ConfigService],
		},
	],
	exports: ['PAYMENTS_MICROSERVICE', PaymentsModule, PaymentsService, PaymentsProcessor],
})
export class PaymentsModule {}
