import { Module } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Clients } from './entities/clients.entity'
import { ClientsService } from './clients.service'
import { Users } from '../users/entities/users.entity'
import { BasicStrategy } from '../auth/strategies/auth-basic.strategy'
import { PassportModule } from '@nestjs/passport'
import { NotificationsService } from 'src/utils/notifications/notifications.service'
import { HttpModule } from '@nestjs/axios'
import { Notifications } from 'src/utils/notifications/entities/notification.entity'
import { NotificationsModule } from 'src/utils/notifications/notifications.module'
import { UsersModule } from '../users/users.module'
import { AddressesModule } from '../addresses/addresses.module'
import { CaddyModule } from '../caddy/caddy.module'
import { Addresses } from '../addresses/entities/address.entity'
import { PaymentsModule } from '../payments/payments.module'
import { ClientIntegration } from './entities/client-integration.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([Clients, Users, Notifications, Addresses, ClientIntegration]),
		PassportModule,
		HttpModule,
		NotificationsModule,
		UsersModule,
		AddressesModule,
		CaddyModule,
		PaymentsModule,
	],
	providers: [ClientsService, BasicStrategy],
	controllers: [ClientsController],
	exports: [ClientsModule, ClientsService],
})
export class ClientsModule {}
