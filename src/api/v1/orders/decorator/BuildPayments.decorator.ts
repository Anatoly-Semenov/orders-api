import { InternalServerErrorException } from '@nestjs/common'
import { EPaymentMethod, EPaymentProvider } from '../../payments/enums/payments.enum'

import { EOrderSource, OrderPaymentStatuses } from '../enums/orders.enums'
import * as _ from 'lodash'
import * as Sentry from '@sentry/node'

export const BuildPaymentsDecorator = () => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		console.log('Call BuildPaymentsDecorator | ', { target, propertyKey, descriptor })

		const originalMethod = descriptor.value
		descriptor.value = async function (...args: any) {
			try {
				const dto = args[args.length - 1]
				if (dto) {
					const providerPaymentMethod = dto?.providerPaymentMethod
					const items = dto?.items
					dto.payments = dto.payments.filter((payment) => +payment.amount !== 0)
					dto.payments = dto?.payments?.map((payment) => {
						let id = {}
						let status
						if (dto.orderSource == EOrderSource.PLATFORM || dto.id) {
							status = OrderPaymentStatuses.PAID
						} else {
							status = OrderPaymentStatuses.NOTPAID
						}

						const otherData: any = {}
						if (payment.id) {
							id = {
								id: payment.id,
							}
							status = payment.status
							otherData.providerPaymentURL = payment.providerPaymentURL
							otherData.providerPaymentDetails = payment.providerPaymentDetails
							otherData.providerPaymentStatus = payment.providerPaymentStatus
							otherData.providerPaymentErrorCode = payment.providerPaymentErrorCode
							otherData.providerPaymentId = payment.providerPaymentId
						}
						const paymentCandidate = {
							...id,
							amount: payment.amount,
							method: payment.method,
							providerPaymentMethod: payment.providerPaymentMethod || providerPaymentMethod,
							type: payment.type,
							isFree: !!payment.isFree,
							provider: EPaymentProvider.TINKOFF,
							userEmail: dto.customer.userEmail,
							phone: dto.customer.phone,
							status,
							items,
							client: dto.client,
							...otherData,
						}
						return paymentCandidate
					})
					this.updatePaymentStatus(dto)

					console.log('BuildPaymentsDecorator data | ', args)
				}
				return await originalMethod.apply(this, args)
			} catch (error) {
				Sentry.captureException(error)
				throw new InternalServerErrorException(error)
			}
		}
	}
}
