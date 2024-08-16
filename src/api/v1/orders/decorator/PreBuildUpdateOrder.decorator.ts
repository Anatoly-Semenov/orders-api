import { InternalServerErrorException, Logger } from '@nestjs/common'
import { OrderCustomer } from '../entities/order-customer.entity'
import { Orders } from '../entities/orders.entity'
import * as Sentry from '@sentry/node'

export const PreBuildUpdateOrderDecorator = () => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: any) {
			try {
				const logger = new Logger('PreBuildUpdateOrderDecorator')
				const dto = args[args.length - 1]
				const transaction = args[args.length - 2]
				if (dto) {
					let oldOrder
					if (transaction?.createQueryBuilder) {
						oldOrder = transaction.createQueryBuilder(Orders, 'order')
					} else {
						oldOrder = this.ordersRepository.createQueryBuilder('order')
					}
					oldOrder = await oldOrder
						.useTransaction(true)
						.setLock('pessimistic_write', undefined, ['"order"'])
						.leftJoinAndSelect('order.payments', 'payments')
						.where('order.id = :id', { id: dto.id })
						.getOne()

					if (!dto?.orderServices?.length) {
						delete args[args.length - 1]?.price
					}
					args[args.length - 1] = {
						...oldOrder,
						...args[args.length - 1],
					}
					logger.debug(`PreBuildUpdateOrderDecorator dto: ${JSON.stringify(dto)}`)
					const timeCheckPromise = await this.checkOrderTime(dto)
					const customerEmail = dto?.customer?.userEmail
					let customerPromise: Promise<OrderCustomer | void> = Promise.resolve()
					if (customerEmail) {
						const params = {
							where: { userEmail: customerEmail },
						}
						logger.debug(`PreBuildUpdateOrderDecorator params: ${JSON.stringify(params)}`)
						if (transaction?.findOne) {
							customerPromise = transaction.findOne(OrderCustomer, params)
						} else {
							customerPromise = this.ordersCustomerRepository.findOne(params)
						}
					}
					const [timeCheck, customer] = await Promise.all([timeCheckPromise, customerPromise])
					if (timeCheck) throw new InternalServerErrorException('Time range is already taken')

					args[args.length - 1].customer = customer
						? { ...customer, ...dto.customer }
						: dto.customer
				}

				return await originalMethod.apply(this, args)
			} catch (error) {
				Sentry.captureException(error)
				throw new InternalServerErrorException(error)
			}
		}
	}
}
