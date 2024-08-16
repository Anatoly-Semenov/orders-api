import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notifications } from './entities/notification.entity'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Config } from 'src/config/main.config'

@Module({
	imports: [TypeOrmModule.forFeature([Notifications]), HttpModule, ConfigModule],
	providers: [
		NotificationsService,
		{
			provide: 'SUBSCRIBERS_SERVICE',
			useFactory: (configService: ConfigService) => {
				return ClientProxyFactory.create({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get<string>(Config.RABBIT_MQ_URL)],
						queue: 'notifications',
						queueOptions: {
							durable: true,
						},
					},
				})
			},
			inject: [ConfigService],
		},
	],
	controllers: [NotificationsController],
	exports: ['SUBSCRIBERS_SERVICE', NotificationsService, NotificationsModule],
})
export class NotificationsModule {}
