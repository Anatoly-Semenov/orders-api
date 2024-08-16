import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as Sentry from '@sentry/node'

import { CreatePaymentDto } from './dto/payment/create-payment.dto'
import { OrderPaymentStatuses } from '../orders/enums/orders.enums'
import { Payments } from './entities/payment.entity'
import { EPaymentProvider } from './enums/payments.enum'
import { TinkoffPaymentService } from './services/tinkoff/tinkoff-payment.service'
import { ETinkoffPaymentObject } from './enums/tinkoff/tinkoff.enum'
import { ClientProxy } from '@nestjs/microservices'
import { CreateMerchantShopInTinkoffDto } from './dto/tinkoff/create-merchant-shop-in-tinkoff.dto'
import { TinkoffNotificationDto } from './dto/payment/tinkoff-notification.dto'
import { ConfigService } from '@nestjs/config'
import { TinkoffConfig } from 'src/config/tinkoff.config'
import { Config } from 'src/config/main.config'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { checkExpiredLinkProcessName } from './constants'
import { DeletePaymentQueueDto } from './dto/payment/delete-payment-queue.dto'
import { getPaymentLinkExpiredDateString } from './utils/getPaymentLinkExpiredDateString.util'

@Injectable()
export class PaymentsService {
	constructor(
		private readonly tinkoffPaymentService: TinkoffPaymentService,

		private readonly configService: ConfigService,

		@InjectQueue('payments')
		private readonly paymentsQueue: Queue,

		@InjectRepository(Payments)
		private readonly paymentRepository: Repository<Payments>,

		@Inject('PAYMENTS_MICROSERVICE')
		private paymentsMicroservice: ClientProxy,
	) {}

	async createPaymentInBank(payment: CreatePaymentDto): Promise<Payments> {
		const RedirectDueDate = getPaymentLinkExpiredDateString(payment.client.paymentLinkSeconds)

		const { taxation, terminalKey, tax, url_notification } = this.configService.get<TinkoffConfig>(
			Config.TINKOFF,
		)

		const frontendHost = this.configService.get<string>(Config.FRONTEND_HOST)

		try {
			let paymentInProvider
			switch (payment.provider) {
				case EPaymentProvider.TINKOFF:
					let shopsData = {}
					if (payment?.client?.merchantData && payment?.client?.merchantData?.shopCode) {
						shopsData = {
							Shops: [
								...payment.items.map((i) => {
									return {
										ShopCode: payment?.client?.merchantData?.shopCode,
										Amount: +i.price * 100,
										Name: i.name,
									}
								}),
							],
						}
					}

					const supplierInfo = payment?.client?.merchantData && {
						Phones: [payment?.client?.merchantData?.ceo.phone],
						Name: payment.client.merchantData.name,
						Inn: payment.client.merchantData.inn,
					}

					paymentInProvider = await this.tinkoffPaymentService.init({
						Amount: +payment.amount * 100,
						OrderId: payment.orderId,
						TerminalKey: terminalKey,
						DATA: {
							OrderId: payment.orderId,
							ClientId: payment.client.id,
						},
						...shopsData,
						Receipt: {
							Email: payment.userEmail,
							EmailCompany: payment?.client?.meta?.email,
							Taxation: taxation,
							Phone: payment.phone,
							Payments: {
								Electronic: +payment.amount * 100,
							},
							Items: payment.items.map((os) => {
								return {
									Amount: os.price * 100,
									Price: os.onePrice * 100,
									Quantity: os.count,
									PaymentMethod: payment.providerPaymentMethod,
									PaymentObject: ETinkoffPaymentObject.SERVICE,
									Tax: tax,
									Name: os.name,
									...(supplierInfo
										? {
												SupplierInfo: supplierInfo,
										  }
										: {}),
								}
							}),
						},
						SuccessURL: `https://${payment?.client?.idAlias}.${frontendHost}/order/pay/success`,
						FailURL: `https://${payment?.client?.idAlias}.${frontendHost}/order/pay/bad`,
						RedirectDueDate,
						NotificationURL: url_notification,
					})

					break
			}

			return {
				...paymentInProvider,
				order: {
					id: payment.orderId,
				},
				providerPaymentURL: paymentInProvider?.PaymentURL || '',
				providerPaymentDetails: paymentInProvider?.Details || '',
				providerPaymentStatus: paymentInProvider?.Status || '',
				providerPaymentErrorCode: paymentInProvider?.ErrorCode || '',
				providerPaymentId: paymentInProvider?.PaymentId || '',
			}
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async createPayment(payment: CreatePaymentDto, transaction?): Promise<Payments> {
		try {
			let paymentInProvider = null

			if (transaction?.createQueryBuilder) {
				const currentPayment = await transaction
					.createQueryBuilder(Payments, 'payment')
					.useTransaction(true)
					.setLock('pessimistic_write')
					.where('payment.id = :id', { id: payment.id })
					.getOne()

				if (currentPayment) {
					return currentPayment
				}
			}

			if (
				(payment.status != OrderPaymentStatuses.PAID || OrderPaymentStatuses.PREPAYMENT) &&
				payment.createFirstPaymentInBank &&
				!payment.isFree &&
				payment.items
			) {
				paymentInProvider = await this.createPaymentInBank(payment)
			}

			if (!payment.items) delete payment.items
			const dataToSave = {
				...payment,
				order: {
					id: payment.orderId,
				},
				providerPaymentURL: paymentInProvider?.PaymentURL || payment.providerPaymentURL || '',
				providerPaymentDetails: paymentInProvider?.Details || payment.providerPaymentDetails || '',
				providerPaymentStatus: paymentInProvider?.Status || payment.providerPaymentStatus || '',
				providerPaymentErrorCode:
					paymentInProvider?.ErrorCode || payment.providerPaymentErrorCode || '',
				providerPaymentId: paymentInProvider?.PaymentId || payment.providerPaymentId || '',
			}

			let result
			if (transaction?.save) {
				result = await transaction.save(Payments, dataToSave)
			} else {
				result = await this.paymentRepository.save(dataToSave)
			}

			await this.paymentsQueue.add(
				checkExpiredLinkProcessName,
				new DeletePaymentQueueDto({
					paymentId: result.id,
				}),
				{ delay: (payment?.client?.paymentLinkSeconds + 10) * 1000, attempts: 10, backoff: 10000 },
			)

			return result
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async createMerchantShop(dto: CreateMerchantShopInTinkoffDto): Promise<any> {
		try {
			switch (dto.provider) {
				case EPaymentProvider.TINKOFF:
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					delete dto.id
					delete dto.provider
					const result = await this.tinkoffPaymentService.createMerchantShopInTinkoff(dto)
					return result
				default:
					throw new InternalServerErrorException('createMerchantShop - provider not available')
			}
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	sendTinkoffNotification(dto: TinkoffNotificationDto): void {
		this.paymentsMicroservice.emit('tinkoffNotification', dto)
	}

	async findOne(id: number, relations: string[]): Promise<Payments> {
		try {
			return this.paymentRepository.findOne({
				where: {
					id,
				},
				relations,
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new NotFoundException(`Failed to find payment with id ${id}`)
		}
	}

	async deleteOne(id: number): Promise<number> {
		const deleted = await this.paymentRepository.delete({
			id: id,
		})
		return deleted.affected
	}
}
