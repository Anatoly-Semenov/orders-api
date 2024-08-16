import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { Orders } from './entities/orders.entity'
import { PaymentsModule } from '../payments/payments.module'
import { HttpModule } from '@nestjs/axios'
import { Clients } from '../clients/entities/clients.entity'
import { UsersCardsModule } from '../users-cards/users-cards.module'
import { Rate } from 'src/api/v1/rates/entities/rate.entity'
import { OrderCustomer } from './entities/order-customer.entity'
import { ServicesModule } from '../services/services.module'
import { Services } from '../services/entities/services.entity'
import { OrderTech } from './entities/order-tech.entity'
import { NotificationsModule } from 'src/utils/notifications/notifications.module'
import { Payments } from '../payments/entities/payment.entity'
import { OrderService } from './entities/order-service.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Orders,
			OrderTech,
			Services,
			OrderCustomer,
			Clients,
			Rate,
			Payments,
			OrderService,
		]),
		HttpModule,
		forwardRef(() => PaymentsModule),
		UsersCardsModule,
		ServicesModule,
		NotificationsModule,
	],
	controllers: [OrdersController],
	providers: [OrdersService],
	exports: [OrdersModule, OrdersService],
})
export class OrdersModule {}
