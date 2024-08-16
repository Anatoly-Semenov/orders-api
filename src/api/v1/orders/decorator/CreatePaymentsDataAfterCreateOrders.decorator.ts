import { InternalServerErrorException } from '@nestjs/common'
import * as Sentry from '@sentry/node'

export const PaymentsDataAfterCreateOrderDecorator = () => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		console.log('Call PaymentsDataAfterCreateOrderDecorator | ', {
			target,
			propertyKey,
			descriptor,
		})

		const originalMethod = descriptor.value
		descriptor.value = async function (...args: any) {
			try {
				const dto = args[args.length - 1]
				const order = await originalMethod.apply(this, args)

				const paymentsPromises = []

				for (const payment of dto.payments) {
					const paymentCandidate = this.paymentsService.createPayment(
						{
							...payment,
							orderId: order.id,
							createFirstPaymentInBank: dto.createFirstPaymentInBank,
						},
						args[args.length - 2],
					)
					paymentsPromises.push(paymentCandidate)
				}
				const payments = await Promise.all(paymentsPromises)
				args[args.length - 1].payments = payments?.length ? payments : []

				console.log('PaymentsDataAfterCreateOrderDecorator data | ', args)

				return {
					...args[args.length - 1],
					id: order.id,
					created: order.created,
				}
			} catch (error) {
				Sentry.captureException(error)
				throw new InternalServerErrorException(error)
			}
		}
	}
}
