import { InternalServerErrorException } from '@nestjs/common'
import { OrderPriceLib } from 'price-lib'
import * as Sentry from '@sentry/node'

export const UpdatePriceDecorator = () => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: any) {
			try {
				const dto = args[args.length - 1]
				const orderPriceLibInstance = new OrderPriceLib(dto, {
					useTimeZone: true,
					server: true,
				})
				const orderPriceLibResult = orderPriceLibInstance.calc()

				args[args.length - 1].price = Number(orderPriceLibResult.fullPrice)

				return await originalMethod.apply(this, args)
			} catch (error) {
				Sentry.captureException(error)
				throw new InternalServerErrorException(error)
			}
		}
	}
}
