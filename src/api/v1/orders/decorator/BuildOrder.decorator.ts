import { InternalServerErrorException, Logger } from '@nestjs/common'
import {
	EPaymentMethod,
	EPaymentProvider,
	EPaymentType,
	Language,
} from '../../payments/enums/payments.enum'
import { ETinkoffPaymentMethod } from '../../payments/enums/tinkoff/tinkoff.enum'
import { EServicePrepayment } from '../../services/enums/service.enum'
import { CreateOrderDto } from '../dto/create-order.dto'
import { EOrderSource, OrderPaymentStatuses, Statuses } from '../enums/orders.enums'
import { OrderPriceLib } from 'price-lib'
import * as _ from 'lodash'
import * as Sentry from '@sentry/node'

export const BuildOrderDecorator = () => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		console.log('Call BuildOrderDecorator | ', { target, propertyKey, descriptor })

		const originalMethod = descriptor.value
		descriptor.value = async function (...args: any) {
			try {
				const [userId, dto]: [number, CreateOrderDto] = args

				if (!dto?.customer?.userEmail) {
					throw new InternalServerErrorException('Customer is required')
				}

				//Проверяем и чистим цели
				this.checkAndUpdateTarget(dto)

				// Объявляем библиотеку для расчета цен
				const orderPriceLibInstance = new OrderPriceLib(dto, {
					useTimeZone: true,
					server: true,
				})

				//Промисы для доп данных
				const timeCheckPromise = this.checkOrderTime(dto)
				const clientPromise = this.clientsRepository.findOne(dto.clientId, {
					relations: ['merchantData'],
				})
				const customerPromise = this.ordersCustomerRepository.findOne({
					where: { userEmail: dto.customer.userEmail },
				})
				const [timeCheck, customer, client] = await Promise.all([
					timeCheckPromise,
					customerPromise,
					clientPromise,
				])

				if (timeCheck) throw new InternalServerErrorException('Time range is already taken')

				// Считаем цены заказа
				const orderPriceLibResult = orderPriceLibInstance.calc()

				const { service } = orderPriceLibInstance.orderService

				const items = (() => {
					let res: {
						count: number
						price: number
						onePrice?: number
						name: string
					}[] = [
						{
							count: orderPriceLibInstance.orderService?.count || 1,
							price: orderPriceLibResult.discountedPrice,
							name: service.title,
						},
					]

					if (service.prepayment === EServicePrepayment.MainAndAdditional) {
						res = _.concat(
							res,
							orderPriceLibResult.additionalServices.map(({ priceData, count, priceLib }) => {
								return {
									count,
									price: priceData.price,
									name: priceLib.service.title,
								}
							}),
						)
					}

					const { prepaymentPrice = 0, placesPrice = 0 } = orderPriceLibResult

					//Если есть платные места, то добавляем в items
					if (service.prepayment === EServicePrepayment.MainAndAdditional && placesPrice > 0) {
						res.push({
							count: 1,
							price: placesPrice,
							onePrice: placesPrice,
							name: 'Доп. оплата за количество человек',
						})
					}

					//Корректируем цену items (Отрезаем всё, что после запятой у float цен и заносим в массив, после чего суммируем их и добавляем к самой дорогой поции)
					const sliceItems = (items: typeof res) => {
						//Сумма цен всех позиций
						const fullPrice = res.reduce((old, current) => {
							return old + (current?.price || 0)
						}, 0)

						//Получаем процент предоплаты
						const differencePrepaymentPercent = (fullPrice - prepaymentPrice) / fullPrice

						//Тут храним все остатки от цен
						const remains: number[] = []

						items = items
							.sort((a, b) => b.price - a.price)
							.map((item) => {
								if (prepaymentPrice > 0) {
									item.price = item.price - item.price * differencePrepaymentPercent
								}

								//Получаем и убираем remains
								const remainsValue = item.price - parseInt(`${item.price}`)
								remains.push(remainsValue)
								item.price -= remainsValue

								item.onePrice = item.price / item.count
								return item
							})
							.filter(({ price }) => price > 0)

						//Добавляем к самой дорогой позиции наши "кусочки" от цен
						items[0] &&= (() => {
							const { price, count } = items[0]

							const newPrice = price + +remains.reduce((old, cur) => (old += cur), 0).toFixed(0)

							return {
								...items[0],
								price: newPrice,
								onePrice: newPrice / count,
							}
						})()

						return items
					}

					return sliceItems(res)
				})()

				dto.price = Number(orderPriceLibResult.fullPrice)

				// Устанавливаем важные параметры исходя из логики
				if (dto.createFirstPaymentInBank && orderPriceLibResult.prepaymentPrice > 0) {
					dto.createFirstPayment = true
					if (dto.createFirstPaymentInBank) {
						dto.status = Statuses.Inprocess
					}
				}

				const user = userId ? { userId: { id: userId } } : {}

				// Если включен параметр createFirstPayment и нет платежей с фронта - создаем их
				const providerPaymentMethod =
					orderPriceLibResult.fullPrice == orderPriceLibResult.prepaymentPrice
						? ETinkoffPaymentMethod.FULL_PREPAYMENT
						: ETinkoffPaymentMethod.PREPAYMENT
				if (dto.createFirstPayment && !dto?.payments?.length) {
					dto.payments = [
						{
							amount: orderPriceLibResult.prepaymentPrice,
							currency: dto.currency,
							isFree: orderPriceLibResult.prepaymentPrice ? false : true,
							language: Language.RU,
							provider: EPaymentProvider.TINKOFF,
							status: OrderPaymentStatuses.PAID,
							createFirstPaymentInBank: dto.createFirstPaymentInBank,
							providerPaymentMethod,
							method: dto.createFirstPaymentInBank
								? EPaymentMethod.ONLINE_PAYMENT
								: EPaymentMethod.CASH,
							type: EPaymentType.PREPAYMENT,
							userEmail: dto.customer.userEmail,
							phone: dto.customer.phone,
						},
					]
				}

				const resultDto = _.omit(dto, ['user'])
				resultDto.customer = customer ? { ...customer, ...dto.customer } : dto.customer

				args[1] = {
					...resultDto,
					...user,
					client,
					providerPaymentMethod,
					items,
				}

				console.log('BuildOrderDecorator | bind args to create order method | ', args)

				return await originalMethod.apply(this, args)
			} catch (error) {
				Sentry.captureException(error)
				throw new InternalServerErrorException(error)
			}
		}
	}
}
