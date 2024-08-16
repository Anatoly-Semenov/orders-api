import {
	CacheInterceptor,
	CacheModule,
	HttpException,
	MiddlewareConsumer,
	Module,
} from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { RavenInterceptor, RavenModule } from 'nest-raven'
import { Connection, ConnectionOptions } from 'typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './api/v1/auth/auth.module'
import { ClientsModule } from './api/v1/clients/clients.module'
import { UsersModule } from './api/v1/users/users.module'
import { NotificationsModule } from './utils/notifications/notifications.module'
import { ClientPaymentsSettingsModule } from './api/v1/clients-payments-settings/client-payments-settings.module'
import { OrdersModule } from './api/v1/orders/orders.module'
import { UserScheduleModule } from './api/v1/user-schedules/user-schedule.module'
import { ServicesCategoriesModule } from './api/v1/services-categories/services-categories.module'
import { ClientsCategoriesModule } from './api/v1/clients-categories/clients-categories.module'
import { FilesModule } from './api/v1/files/files.module'
import { PaymentsModule } from './api/v1/payments/payments.module'
import { AddressesModule } from './api/v1/addresses/addresses.module'
import { FilterModule } from './utils/filter/filter.module'
import { RatesModule } from './api/v1/rates/rates.module'
import { RecurrentsModule } from './api/v1/recurrents/recurrents.module'
import { ServicesModule } from './api/v1/services/services.module'
// import { ServicesPriceSettingsModule } from './api/v1/services-price-settings/services-price-settings.module';
import { CaddyModule } from './api/v1/caddy/caddy.module'
import { ExtractUserGuard } from './api/v1/orders/guards/jwt-auth.guard'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { Config, mainConfig } from './config/main.config'
import { validationSchema } from './config/validation'
import { RedisConfig } from './config/redis.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [mainConfig],
			isGlobal: true,
			validationSchema,
		}),
		CacheModule.register({ ttl: 600, isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => config.get<ConnectionOptions>(Config.DATABASE),
		}),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					redis: config.get<RedisConfig>(Config.REDIS),
				}
			},
		}),
		UsersModule,
		ClientsModule,
		AuthModule,
		NotificationsModule,
		ClientPaymentsSettingsModule,
		OrdersModule,
		OrdersModule,
		UserScheduleModule,
		ServicesCategoriesModule,
		ClientsCategoriesModule,
		FilesModule,
		RavenModule,
		PaymentsModule,
		AddressesModule,
		FilterModule,
		RatesModule,
		RecurrentsModule,
		ServicesModule,
		CaddyModule,
		// ServicesPriceSettingsModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ExtractUserGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useValue: new RavenInterceptor({
				filters: [
					{
						type: HttpException,
						filter: (exception: HttpException) => 500 > exception.getStatus(),
					},
				],
			}),
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
		AppService,
	],
})
export class AppModule {
	constructor(private connection: Connection) {}

	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
