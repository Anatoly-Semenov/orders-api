import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as Sentry from '@sentry/node'
import { AuthModule } from './api/v1/auth/auth.module'
import { UsersModule } from './api/v1/users/users.module'
import { ClientsCategoriesModule } from './api/v1/clients-categories/clients-categories.module'

import { AddressesModule } from './api/v1/addresses/addresses.module'
import { ClientsModule } from './api/v1/clients/clients.module'
import { ServicesModule } from './api/v1/services/services.module'

import { FilesModule } from './api/v1/files/files.module'
// import { ServicesPriceSettingsModule } from './api/v1/services-price-settings/services-price-settings.module';
import { OrdersModule } from './api/v1/orders/orders.module'
import { PaymentsModule } from './api/v1/payments/payments.module'
import { NewrelicInterceptor } from './newrelic.interceptor'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	})
	app.setGlobalPrefix('v1', {
		exclude: [
			// { path: 'health', method: RequestMethod.GET }
		],
	})
	const basePath =
		process.env.NODE_ENV == 'production'
			? process.env.BACKEND_URL_PRODUCTION
			: 'http://localhost:3000'
	app.useGlobalInterceptors(new NewrelicInterceptor())

	const config = new DocumentBuilder()
		.setTitle('Main API')
		.setBasePath(basePath)
		.setDescription('Main api documentation')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config, {
		include: [
			AuthModule,
			UsersModule,
			ClientsCategoriesModule,
			ClientsModule,
			AddressesModule,
			ServicesModule,
			FilesModule,
			// ServicesPriceSettingsModule,
			OrdersModule,
			PaymentsModule,
		],
	})
	SwaggerModule.setup('docs', app, document)

	Sentry.init({
		dsn: process.env.SENTRYDNS,
		integrations: [
			// enable HTTP calls tracing
			new Sentry.Integrations.Http({ tracing: true }),
			...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
		],
		profilesSampleRate: 1.0,
		tracesSampleRate: 1.0,
	})

	const queues = ['payments_queue']
	for (const queue of queues) {
		await app.connectMicroservice<MicroserviceOptions>({
			transport: Transport.RMQ,
			options: {
				urls: [`${process.env.RABBIT_MQ_URL}`],
				queue: queue,
				queueOptions: {
					durable: false,
				},
			},
		})
	}

	app.startAllMicroservices()
	await app.listen(3000)
}

bootstrap()
