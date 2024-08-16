import * as Sentry from '@sentry/node'
import { QBException } from '../utils/CustomError'

export const ThrowError = (controller: string, service: string) => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: any[]) {
			try {
				return await originalMethod.apply(this, args)
			} catch (error) {
				const statusCode = error?.statusCode || error?.response?.statusCode || error?.status || 500

				const message = error
				const e = new QBException(message, statusCode)
				console.error(e)
				Sentry.captureException(e)

				throw e
			}
		}
	}
}
