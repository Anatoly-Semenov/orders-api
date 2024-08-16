/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { render, OrderMail, OrderLogger } from 'svelte-emaileo'

import { isEqual } from 'lodash'
import { Brackets, Connection, getConnection, In, Repository } from 'typeorm'
import { PaymentsService } from '../payments/payments.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { FilterOrdersDto } from './dto/filter-orders.dto'
import { OrderPaymentDto } from './dto/order-payment.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Orders } from './entities/orders.entity'
import { EOrderSource, FilterStatuses, OrderPaymentStatuses, Statuses } from './enums/orders.enums'
import { orderFilterSql } from './sql/orders.sql'
import { OrderCustomer } from './entities/order-customer.entity'
import { Services } from '../services/entities/services.entity'
import { OrderAdditionalService } from './entities/order-additional-service.entity'
import { CreateOrderTechDto } from './dto/create-order-tech.dto'
import { UpdateOrderTechDto } from './dto/update-order-tech.dto'
import { FilterOrdersV2Dto } from './dto/filter-order-v2.dto'

import { NotificationsService } from 'src/utils/notifications/notifications.service'
import * as _ from 'lodash'
import { Payments } from '../payments/entities/payment.entity'
import { OrderService } from './entities/order-service.entity'
import { UpdateOrderServiceDto } from './dto/update-order-service.dto'
import { MinimalOrder } from './interfaces/minimal-order.interface'
import { formatIncompletePhoneNumber } from 'libphonenumber-js'
import { BuildOrderDecorator } from './decorator/BuildOrder.decorator'
import { PaymentsDataAfterCreateOrderDecorator } from './decorator/CreatePaymentsDataAfterCreateOrders.decorator'
import { EPaymentMethod } from '../payments/enums/payments.enum'
import { UpdatePriceDecorator } from './decorator/UpdatePrice.decorator'
import { EmailType } from './enums/email-type.enums'
import { EmailTypeToText, OperationsAmount } from './constants'

import { BuildPaymentsDecorator } from './decorator/BuildPayments.decorator'
import { PreBuildUpdateOrderDecorator } from './decorator/PreBuildUpdateOrder.decorator'
import { TinkoffNotificationDto } from '../payments/dto/payment/tinkoff-notification.dto'
import * as testData from './test-data/orders.json'
import { OrderManager } from 'src/utils/OrderManager/OrderManager'
import { Clients } from '../clients/entities/clients.entity'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { Users } from '../users/entities/users.entity'
import { Role } from '../users/enums/user-roles.enum'
import { EServicePrepayment } from '../services/enums/service.enum'
import { Semaphore } from 'src/utils/Semaphore'
import { exportOrdersToExcel } from './utils/export.util'
import { ExportOrdersDTO } from './dto/export-orders.dto'
import { Readable } from 'stream'
import { FindOrderCustomerDto } from './dto/find-order-customer.dto'
import { OrderFreeAdditionalService } from './entities/order-free-additional-service.entity'
import { DeleteResponseDto } from '../system/dto/delete-response.dto'
import * as dayjs from 'dayjs'
import * as Sentry from '@sentry/node'

@Injectable()
export class OrdersService {
	private readonly logger = new Logger(OrdersService.name)
	private readonly synchronization: Semaphore = new Semaphore(OrdersService.name, OperationsAmount)
	constructor(
		@InjectRepository(Clients)
		private clientsRepository: Repository<Clients>,

		@InjectRepository(OrderCustomer)
		private ordersCustomerRepository: Repository<OrderCustomer>,

		@InjectRepository(Payments)
		private paymentsRepository: Repository<Payments>,

		@InjectRepository(OrderService)
		private orderServiceRepository: Repository<OrderService>,

		@InjectRepository(Orders)
		private ordersRepository: Repository<Orders>,

		@InjectRepository(Services)
		private servicesRepository: Repository<Services>,

		private readonly connection: Connection,

		@Inject(forwardRef(() => PaymentsService))
		private readonly paymentsService: PaymentsService,

		private readonly notificationService: NotificationsService,
	) {}
	private async checkOrderTime(dto: CreateOrderDto | CreateOrderTechDto): Promise<any> {
		let timeCheck = this.ordersRepository
			.createQueryBuilder('order')
			.leftJoinAndSelect('order.orderServices', 'orderServices')
			.leftJoin('order.client', 'client')
			.where(
				new Brackets((qb) => {
					qb.where(
						new Brackets((qb) => {
							qb.where('order.dateTimeStart < :dateTimeStart', {
								dateTimeStart: dto.dateTimeStart,
							}).andWhere('order.dateTimeEnd > :dateTimeStart', {
								dateTimeStart: dto.dateTimeStart,
							})
						}),
					)
						.orWhere(
							new Brackets((qb) => {
								qb.where('order.dateTimeStart < :dateTimeEnd', {
									dateTimeEnd: dto.dateTimeEnd,
								}).andWhere('order.dateTimeEnd > :dateTimeEnd', {
									dateTimeEnd: dto.dateTimeEnd,
								})
							}),
						)
						.orWhere(
							new Brackets((qb) => {
								qb.where('order.dateTimeEnd > :dateTimeStart', {
									dateTimeStart: dto.dateTimeStart,
								}).andWhere('order.dateTimeEnd < :dateTimeEnd', {
									dateTimeEnd: dto.dateTimeEnd,
								})
							}),
						)
						.orWhere(
							new Brackets((qb) => {
								qb.where('order.dateTimeStart > :dateTimeStart', {
									dateTimeStart: dto.dateTimeStart,
								}).andWhere('order.dateTimeStart < :dateTimeEnd', {
									dateTimeEnd: dto.dateTimeEnd,
								})
							}),
						)
						.orWhere(
							new Brackets((qb) => {
								qb.where(':dateTimeStart >= order.dateTimeStart', {
									dateTimeStart: dto.dateTimeStart,
								}).andWhere(':dateTimeEnd <= order.dateTimeEnd', {
									dateTimeEnd: dto.dateTimeEnd,
								})
							}),
						)
						.orWhere(
							new Brackets((qb) => {
								qb.where(':dateTimeStart <= order.dateTimeStart', {
									dateTimeStart: dto.dateTimeStart,
								}).andWhere(':dateTimeEnd >= order.dateTimeEnd', {
									dateTimeEnd: dto.dateTimeEnd,
								})
							}),
						)
				}),
			)
			.andWhere('order.status != :status', { status: Statuses.Canceled })
			.andWhere('client.id = :clientId', { clientId: dto.clientId })
		if ('id' in dto && dto.id) {
			timeCheck = timeCheck.andWhere('order.id != :orderId', {
				orderId: dto.id,
			})
		}

		const orders = (await timeCheck.getMany()).filter((o) => +o.id !== +dto.id)

		if (!orders.length) {
			return false
		}
		const checkServicesIds = dto.orderServices.map((item) => +item.service.id)

		const ids = _.concat(
			...orders.map((service) => service.orderServices.map((item) => +item.service.id)),
		)

		return ids.findIndex((id) => checkServicesIds.includes(+id)) !== -1
	}

	@BuildOrderDecorator()
	@BuildPaymentsDecorator()
	@PaymentsDataAfterCreateOrderDecorator()
	async create(userId: number, dto: CreateOrderDto): Promise<any> {
		this.logger.log(`Create order | userId: ${userId}, data: ${JSON.stringify(dto)}`)

		const candidate = this.ordersRepository.create(dto)
		const result: Orders = await this.ordersRepository.save(candidate)
		const serviceHasPrepayment = result.orderServices.every(
			(item) => item.service.prepayment !== EServicePrepayment.Without,
		)

		if (candidate.orderSource === EOrderSource.PLATFORM || !serviceHasPrepayment) {
			this.getOrderEntityAndSendEmail({
				orderId: result.id,
				isCreate: true,
				emailType: EmailType.Create,
			})
		}

		this.logger.log(`Order successful created | data: ${JSON.stringify(result)}`)

		return result

		// throw new InternalServerErrorException('Time range is already taken');
	}

	async createMany(): Promise<any> {
		// @ts-ignore
		const data: any[][] = testData

		const chunks: any[][] = _.chunk(data, 25)
		for (const element of chunks) {
			for (const item of element) {
				await this.create(null, item)
			}
		}
	}

	async getOrder(id: number, relations: string[] = []): Promise<Orders> {
		return await this.ordersRepository.findOne(id, {
			relations,
		})
	}

	async getOrderEntityAndSendEmail({
		orderId,
		isCreate = false,
		emailType,
	}: {
		orderId: number
		isCreate: boolean
		emailType: EmailType
	}) {
		const orderData = await this.getOrder(orderId, ['client'])
		if (!orderData) return
		const order: Orders = new OrderManager(orderData).applyTimezone()
		const company: Clients = order.client
		if (!order || !company) {
			return
		}
		this.sendEmailAboutOrder({ order, company, isCreate }, emailType)
	}

	sendEmailAboutOrder(
		{ order, company, isCreate = false }: { order: Orders; company: Clients; isCreate: boolean },
		type: EmailType,
	) {
		const html = render(OrderMail, { order, company, isCreate })
		const mails = [order.customer.userEmail, company.meta.email]
		const to = mails.join(',')
		this.logger.log(`----Send Email to: ${to}`)
		this.logger.log(
			`----Send Email order: ` +
				JSON.stringify(
					{
						status: order.status,
						id: order.id,
						customer: order.customer,
					},
					null,
					2,
				),
		)

		this.notificationService.sendEmailHtml({
			name: company.clientName,
			to,
			html,
			subject: EmailTypeToText[type],
		})
	}

	async createOrderTech(userId: number, dto: CreateOrderTechDto) {
		this.logger.log(`Create tech order | userId: ${userId}, data: ${JSON.stringify(dto)}`)
		const timeCheck = await this.checkOrderTime(dto)

		if (!timeCheck) {
			// create order
			this.checkAndUpdateTarget(dto)
		}

		const orderCandidate = await this.ordersRepository.save({
			...dto,
			client: {
				id: dto.clientId,
			},
			isTechnicalReservation: true,
			user: { id: userId },
		})

		this.logger.log(`Tech order successful created | data: ${JSON.stringify(orderCandidate)}`)

		return orderCandidate
	}

	async orderSuccess(orderPaymentDto: OrderPaymentDto, user): Promise<Partial<Orders>> {
		// Update Order in db
		const result = await this.ordersRepository.save({
			id: orderPaymentDto.InvoiceId,
			status: Statuses.Paid,
		})

		this.getOrderEntityAndSendEmail({
			orderId: result.id,
			isCreate: true,
			emailType: EmailType.Create,
		})

		return this.getWithoutConfidentData(result, user)
	}

	async orderFiled(orderPaymentDto: OrderPaymentDto) {
		// Remove Order in db
		// Need to payment upadte
		return await this.delete(orderPaymentDto.InvoiceId)
	}

	async getOne(id: number, user): Promise<any | Error> {
		let order = this.ordersRepository.createQueryBuilder('order')

		if (user && this.isUserAvailableFullData(user)) {
			order = order
				.leftJoinAndSelect('order.user', 'user')
				.leftJoinAndSelect('order.customer', 'customer')
				.leftJoinAndSelect('order.payments', 'payments')
		}

		order = order
			.leftJoinAndSelect('order.address', 'orderAddress')
			.leftJoinAndSelect('order.orderServices', 'orderServices')
			.leftJoinAndSelect('orderServices.target', 'orderServiceTarget')
			.leftJoinAndMapMany(
				'orderServices.additionalServices',
				OrderAdditionalService,
				'orderAdditionalServices',
				'orderAdditionalServices.orderServiceId = orderServices.id',
			)
			.leftJoinAndMapMany(
				'orderServices.freeAdditionalServices',
				OrderFreeAdditionalService,
				'orderFreeAdditionalServices',
				'orderFreeAdditionalServices.orderServiceId = orderServices.id',
			)
			.where('order.id = :id', { id })

		return await order.getOne()
	}

	async getAll(user): Promise<Partial<Orders>[]> {
		const orders = await this.ordersRepository.find()
		return orders.map((order) => this.getWithoutConfidentData(order, user))
	}

	async getAllByClient(clientId: string, user): Promise<Partial<Orders>[]> {
		try {
			if (!clientId) throw new InternalServerErrorException('clientId is required')

			const fromDate = dayjs().add(-31, 'd').format('YYYY-MM-DD')
			const toDate = dayjs().add(60, 'd').format('YYYY-MM-DD')

			let orders = this.ordersRepository
				.createQueryBuilder('order')
				.leftJoin('order.client', 'client')

			if (user && this.isUserAvailableFullData(user)) {
				orders = orders
					.leftJoinAndSelect('order.user', 'user')
					.leftJoinAndSelect('order.customer', 'customer')
					.leftJoinAndSelect('order.payments', 'payments')
			}

			orders = orders
				.leftJoinAndSelect('order.address', 'orderAddress')
				.leftJoinAndSelect('order.orderServices', 'orderServices')
				.leftJoinAndSelect('orderServices.target', 'orderServiceTarget')
				.leftJoinAndMapMany(
					'orderServices.additionalServices',
					OrderAdditionalService,
					'orderAdditionalServices',
					'orderAdditionalServices.orderServiceId = orderServices.id',
				)
				.leftJoinAndMapMany(
					'orderServices.freeAdditionalServices',
					OrderFreeAdditionalService,
					'orderFreeAdditionalServices',
					'orderFreeAdditionalServices.orderServiceId = orderServices.id',
				)
				.where(
					'client.id = :clientId AND order.dateTimeStart >= :fromDate AND order.dateTimeStart < :toDate',
					{
						clientId,
						fromDate,
						toDate,
					},
				)
				.limit(4500)

			const foundOrders = await orders.getMany()

			const res: any = foundOrders.map((o) => {
				return {
					clientId,
					...this.getWithoutConfidentData(o, user),
				}
			})
			return res || []
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	async filter(f: FilterOrdersDto, user): Promise<any[]> {
		const queryString = orderFilterSql(f)
		const dbResult: any[] = await this.connection.query(queryString)
		return dbResult.map((order) => this.getWithoutConfidentData(order, user)) || []
	}

	async filterV2(dto: FilterOrdersV2Dto, user): Promise<[Partial<Orders>[], number]> {
		let query = this.ordersRepository
			.createQueryBuilder('order')
			.leftJoin('order.client', 'client')
			.leftJoinAndSelect('order.user', 'user')

		if (user && this.isUserAvailableFullData(user)) {
			query = query
				.leftJoinAndSelect('order.customer', 'customer')
				.leftJoinAndSelect('order.payments', 'payments')
		}

		query = query
			.leftJoinAndSelect('order.address', 'orderAddress')
			.leftJoinAndSelect('order.orderServices', 'orderServices')
			.leftJoinAndSelect('orderServices.target', 'orderServiceTarget')
			.leftJoinAndMapMany(
				'orderServices.additionalServices',
				OrderAdditionalService,
				'orderAdditionalServices',
				'orderAdditionalServices.orderServiceId = orderServices.id',
			)
			.leftJoinAndMapMany(
				'orderServices.freeAdditionalServices',
				OrderFreeAdditionalService,
				'orderFreeAdditionalServices',
				'orderFreeAdditionalServices.orderServiceId = orderServices.id',
			)
			.where('order.clientId = :clientId', { clientId: dto.clientId })

		if (dto.dateTimeEnd) {
			query = query.andWhere('order.dateTimeEnd <= :dateTimeEnd', {
				dateTimeEnd: dto.dateTimeEnd,
			})
		}

		if (dto.dateTimeStart) {
			query = query.andWhere('order.dateTimeEnd >= :dateTimeStart', {
				dateTimeStart: dto.dateTimeStart,
			})
		}

		if (dto.includeStatuses?.length) {
			let includeStatuses = dto.includeStatuses

			if (typeof dto.includeStatuses === 'string') {
				try {
					includeStatuses = JSON.parse(dto.includeStatuses)
				} catch {
					includeStatuses = [dto.includeStatuses]
				}
			}

			query = query.andWhere(
				new Brackets((qb) => {
					qb.where(
						new Brackets((qb) => {
							qb.where('order.status IN (:...includeStatuses)', {
								includeStatuses,
							})

							if (!includeStatuses.includes(FilterStatuses.TechnicalReservation)) {
								qb = qb.andWhere('order.isTechnicalReservation = false')
							}

							if (!includeStatuses.includes(FilterStatuses.Completed)) {
								qb = qb.andWhere('order.isCompleted = false')
							}
						}),
					)

					if (includeStatuses.includes(FilterStatuses.TechnicalReservation)) {
						qb = qb.orWhere('order.isTechnicalReservation = true')
					}

					if (includeStatuses.includes(FilterStatuses.Completed)) {
						qb = qb.orWhere('order.isCompleted = true')
					}
				}),
			)
		} else if (dto.excludeStatuses?.length) {
			let excludeStatuses = dto.excludeStatuses

			if (typeof dto.excludeStatuses === 'string') {
				try {
					excludeStatuses = JSON.parse(dto.excludeStatuses)
				} catch {
					excludeStatuses = [dto.excludeStatuses]
				}
			}

			query = query.andWhere(
				new Brackets((qb) => {
					qb.where(
						new Brackets((qb) => {
							qb.where('order.status NOT IN (:...excludeStatuses)', {
								excludeStatuses,
							})

							if (!excludeStatuses.includes(FilterStatuses.TechnicalReservation)) {
								qb = qb.orWhere('order.isTechnicalReservation = true')
							}

							if (!excludeStatuses.includes(FilterStatuses.Completed)) {
								qb = qb.orWhere('order.isCompleted = true')
							}
						}),
					)

					if (excludeStatuses.includes(FilterStatuses.TechnicalReservation)) {
						qb = qb.andWhere('order.isTechnicalReservation = false')
					}

					if (excludeStatuses.includes(FilterStatuses.Completed)) {
						qb = qb.andWhere('order.isCompleted = false')
					}
				}),
			)
		}

		if (dto.paymentStatus) {
			let paymentStatusList = dto.paymentStatus

			if (typeof dto.paymentStatus === 'string') {
				try {
					paymentStatusList = JSON.parse(dto.paymentStatus)
				} catch {
					paymentStatusList = [dto.paymentStatus]
				}
			}

			query = query.andWhere('order.paymentStatus IN (:...paymentStatusList)', {
				paymentStatusList,
			})
		}

		if (dto.userEmail) {
			query = query.andWhere('user.userEmail like :userEmail', {
				userEmail: `%${dto.userEmail}%`,
			})
		}

		if (dto.userName) {
			query = query.andWhere('user.meta like :userName', {
				userName: `%${dto.userName}%`,
			})
		}

		if (dto.userPhone) {
			console.warn(formatIncompletePhoneNumber(dto.userPhone))
			query = query.andWhere('user.phone = :userPhone', {
				userPhone: formatIncompletePhoneNumber(dto.userPhone),
			})
		}

		if (dto.orderId) {
			query = query.andWhere('order.id = :orderId', { orderId: dto.orderId })
		}

		if (dto.services?.length) {
			let services = dto.services

			if (typeof dto.services === 'string') {
				try {
					services = JSON.parse(dto.services)
				} catch {
					services = [dto.services]
				}
			}

			query = query.andWhere(
				new Brackets((qb) => {
					qb.where(`orderServices.service ::jsonb @> \'{"id":"${services[0]}"}\'`)
					services.forEach((serviceId, index) => {
						qb = qb.orWhere(`orderServices.service ::jsonb @> \'{"id":${serviceId}}\'`)
						if (index === 0) {
							return
						}
						qb = qb.orWhere(`orderServices.service ::jsonb @> \'{"id":"${serviceId}"}\'`)
					})
				}),
			)
		}

		if (dto.addresses?.length) {
			let addresses = dto.addresses

			if (typeof dto.addresses === 'string') {
				try {
					addresses = JSON.parse(dto.addresses)
				} catch {
					addresses = [dto.addresses]
				}
			}

			query = query.andWhere('order.address.id IN (:...addresses)', {
				addresses,
			})
		}

		if (dto.customers?.length) {
			let customers = dto.customers

			if (typeof dto.customers === 'string') {
				try {
					customers = JSON.parse(dto.customers)
				} catch {
					customers = [dto.customers]
				}
			}

			query = query.andWhere('order.customer.id IN (:...customers)', {
				customers,
			})
		}

		const [orders, count]: [Orders[], number] = await query.getManyAndCount()
		const isOnlyDates: boolean =
			typeof dto.onlyDates === 'string' ? dto.onlyDates === 'true' : dto.onlyDates

		try {
			return [
				orders.map((order) => {
					if (isOnlyDates) {
						return {
							clientId: dto.clientId,
							..._.pick(order, ['id', 'dateTimeStart', 'dateTimeEnd']),
						}
					}
					return {
						clientId: dto.clientId,
						...this.getWithoutConfidentData(order, user),
					}
				}),
				count,
			]
		} catch (error) {
			Sentry.captureException(error)
			throw new BadRequestException(error)
		}
	}

	async delete(id: number, isSendEmail = true): Promise<DeleteResponseDto> {
		const message = {
			successful: 'Order successful deleted',
			successfulLog: `Order with id: ${id} successful deleted`,
			error: 'Failed to delete order',
			undefined: `Order with id:${id} is undefined`,
		}

		try {
			const order: Orders = await this.getOrder(id, ['client'])

			if (order) {
				await this.ordersRepository.delete(id)
				this.logger.log(message.successfulLog)

				if (isSendEmail && !order.isTechnicalReservation) await this.sendDeleteEmail(order)

				return { id, message: message.successful }
			} else {
				throw new BadRequestException(message.undefined)
			}
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)
			throw new InternalServerErrorException(message.error)
		}
	}

	async sendDeleteEmail(orderData: Orders): Promise<void> {
		try {
			if (!orderData || orderData.isTechnicalReservation) {
				throw 'Failed send email with deleted order info'
			}

			const order: Orders = new OrderManager(orderData).applyTimezone()
			const company: Clients = order.client

			const html = render(OrderLogger, { order, company })

			await this.notificationService.sendEmailHtml({
				name: company.clientName,
				to: company.meta.email,
				html,
				subject: 'Заказ удалён',
			})
		} catch (error) {
			Sentry.captureException(error)
			throw error
		}
	}

	async setOrderStatus(order: UpdateOrderDto) {
		let orderStatus = OrderPaymentStatuses.WITHOUT_PAYEMNT
		if (order?.payments?.length) {
			if (order.orderSource == EOrderSource.PLATFORM) {
				order.payments = order?.payments?.map((payment) => ({
					...payment,
					status: OrderPaymentStatuses.PAID,
				}))
			}
			const orderPaymentAmounts =
				order?.payments
					?.filter(
						(payment) =>
							payment.status == OrderPaymentStatuses.PAID || OrderPaymentStatuses.PREPAYMENT,
					)
					?.map((payment) => +payment.amount) || []
			let orderPaymentSum = 0
			for (const amount of orderPaymentAmounts) {
				orderPaymentSum += amount
			}
			if (orderPaymentSum >= order.price) {
				orderStatus = OrderPaymentStatuses.PAID
			} else if (orderPaymentSum < order.price && orderPaymentSum > 0) {
				orderStatus = OrderPaymentStatuses.PREPAYMENT
			} else {
				orderStatus = OrderPaymentStatuses.NOTPAID
			}
			const returnedPayment = order?.payments?.filter(
				(payment) => payment.status == OrderPaymentStatuses.RETURNED,
			)
			if (returnedPayment?.length) {
				let returnedPaymentsSum = 0
				const returnedPaymentArray = returnedPayment?.map((payemnt) => +payemnt.amount)
				for (const item of returnedPaymentArray) {
					returnedPaymentsSum += item
				}
				if (returnedPaymentsSum >= order.price) {
					orderStatus = OrderPaymentStatuses.RETURNED
				} else if (returnedPaymentsSum < order.price && orderPaymentSum > 0) {
					orderStatus = OrderPaymentStatuses.PART_RETURNED
				}
			}
		}
		return { ...order, paymentStatus: orderStatus }
	}

	@PreBuildUpdateOrderDecorator()
	@UpdatePriceDecorator()
	@BuildPaymentsDecorator()
	@PaymentsDataAfterCreateOrderDecorator()
	async update(transaction, dto: UpdateOrderDto): Promise<Orders | Error | any> {
		this.logger.log(`Update order | ${JSON.stringify(dto)}`)

		this.checkAndUpdateTarget(dto)
		this.updatePaymentStatus(dto)

		const isOrderChanged = await this.isOrderChanged(dto)

		let changedOrder
		if (transaction) {
			changedOrder = await transaction.save(Orders, dto)
		} else {
			changedOrder = await this.ordersRepository.save(dto)
		}

		if (isOrderChanged) {
			let emailType: EmailType = EmailType.Update
			if (dto.status === Statuses.Canceled) {
				emailType = EmailType.Delete
			}
			this.getOrderEntityAndSendEmail({ orderId: dto.id, emailType, isCreate: false })
		}

		this.logger.log(`Order successful updated | data: ${JSON.stringify(changedOrder)}`)

		return changedOrder
	}

	async updateStatus(dto: UpdateOrderStatusDto): Promise<Orders | Error | any> {
		if (dto.status !== undefined || dto.isCompleted !== undefined) {
			const isOrderChanged = await this.isOrderChanged(dto, ['status'])
			const changedOrder = await this.ordersRepository.save(dto)

			if (isOrderChanged) {
				let emailType: EmailType = EmailType.Update
				if (dto.status === Statuses.Canceled) {
					emailType = EmailType.Delete
				}
				this.getOrderEntityAndSendEmail({ orderId: dto.id, emailType, isCreate: false })
			}

			return changedOrder
		}

		return this.getOrder(dto.id, ['orderServices', 'address', 'payments'])
	}

	async isOrderChanged(
		dto: UpdateOrderDto,
		include = ['status', 'service', 'dateTimeStart', 'dateTimeEnd'],
	) {
		const oldOrder = await this.getOrder(dto.id, ['orderServices', 'address', 'payments'])
		const order = dto

		const conditions: {
			key: (typeof include)[0]
			condition: boolean
		}[] = [
			{
				key: 'service',
				condition: !isEqual(
					(oldOrder.orderServices || [])[0]?.service,
					(order.orderServices || [])[0]?.service,
				),
			},
			{
				key: 'status',
				condition: oldOrder.status !== Statuses.Canceled && order.status === Statuses.Canceled,
			},
			{
				key: 'dateTimeStart',
				condition: +new Date(oldOrder.dateTimeStart) !== +new Date(order.dateTimeStart),
			},
			{
				key: 'dateTimeEnd',
				condition: +new Date(oldOrder.dateTimeEnd) !== +new Date(order.dateTimeEnd),
			},
			{
				key: 'discount',
				condition: +oldOrder.discount !== +order.discount,
			},
			{
				key: 'discountType',
				condition: oldOrder.discountType !== order.discountType,
			},
		].filter(({ key }) => include.includes(key))

		return conditions.findIndex(({ condition }) => condition) !== -1
	}

	async updateOrderTech(updateOrderTechDto: UpdateOrderTechDto): Promise<Orders | Error> {
		this.logger.log(`Update technical order | data: ${JSON.stringify(updateOrderTechDto)}`)

		this.checkAndUpdateTarget(updateOrderTechDto)

		const order = await this.ordersRepository.save({
			...updateOrderTechDto,
			isTechnicalReservation: true,
		})

		this.logger.log(`Technical order successful updated | data: ${JSON.stringify(order)}`)

		return order
	}

	checkAndUpdateTarget(minOrderDto: MinimalOrder) {
		if (minOrderDto.orderServices?.length) {
			minOrderDto.orderServices =
				minOrderDto.orderServices?.map((os: UpdateOrderServiceDto) => {
					if (!os?.target?.id) {
						delete os?.target
					}

					return os
				}) || []
		}
	}

	async exportOrders(exportOrdersDTO: ExportOrdersDTO, user: Users): Promise<Readable> {
		this.logger.log(`Export orders | data: ${JSON.stringify(exportOrdersDTO)}`)

		const orders = (await this.filterV2(exportOrdersDTO.filters, user))[0]
		const response = exportOrdersToExcel(orders, exportOrdersDTO.fields)

		this.logger.log(`Orders successful exported | data: ${JSON.stringify(response)}`)

		return response
	}

	async tinkoffNotification(dto: TinkoffNotificationDto): Promise<void> {
		this.logger.debug(`tinkoffNotification dto: ${JSON.stringify(dto)}`)
		const lock = await this.synchronization.acquire()
		try {
			this.logger.debug(`tinkoffNotification TRY ${JSON.stringify(dto)}`)
			await getConnection().transaction(async (transaction) => {
				await this.processTinkoffNotification(dto, transaction)
			})
		} finally {
			this.logger.debug(`tinkoffNotification FINALLY ${JSON.stringify(dto)}`)
			lock.release()
		}
	}

	async processTinkoffNotification(dto: TinkoffNotificationDto, transaction): Promise<void> {
		let order: any = await transaction
			.createQueryBuilder(Orders, 'order')
			.useTransaction(true)
			.setLock('pessimistic_write')
			.where('order.id = :id', { id: dto.OrderId })
			.getOne()

		order = await transaction.findOne(Orders, dto.OrderId)

		this.logger.debug(`processTinkoffNotification dto: ${JSON.stringify(dto)}`)

		const payment = order.payments.find((payment) => {
			return payment.providerPaymentId == dto.PaymentId
		})
		if (!payment) {
			throw new BadRequestException('Payment was not found')
		}
		let status
		switch (dto.Status) {
			case 'AUTHORIZED':
				status = OrderPaymentStatuses.IN_PROCESS
				break
			case 'CONFIRMED':
				status = OrderPaymentStatuses.PAID
				break
			case 'PARTIAL_REFUND':
				status = OrderPaymentStatuses.PART_RETURNED
				break
			case 'REFUNDED':
				status = OrderPaymentStatuses.RETURNED
				break
			case 'REJECTED':
				status = OrderPaymentStatuses.REJECTED
				break
			default:
				status = OrderPaymentStatuses.NOTPAID
				break
		}

		this.logger.debug(`processTinkoffNotification return status: ${JSON.stringify(status)}`)

		let currentPayment = transaction
			.createQueryBuilder(Payments, 'payment')
			.useTransaction(true)
			.setLock('pessimistic_write')
			.where('payment.id = :id', { id: payment.id })

		currentPayment = await currentPayment.getOne()

		this.logger.debug(
			`processTinkoffNotification currentPayment getOne: ${JSON.stringify(currentPayment)}`,
		)

		if (
			currentPayment.status !== OrderPaymentStatuses.PAID ||
			status !== OrderPaymentStatuses.IN_PROCESS
		) {
			payment.status = status
		}
		payment.providerPaymentErrorCode = dto.ErrorCode
		payment.createFirstPaymentInBank = false

		order.payments = order.payments.filter(
			(payment) => !(payment.providerPaymentId == dto.PaymentId),
		)

		const currentOrder = await transaction
			.createQueryBuilder(Orders, 'order')
			.useTransaction(true)
			.setLock('pessimistic_write')
			.where('order.id = :id', { id: dto.OrderId })
			.getOne()

		this.logger.debug(`processTinkoffNotification currentOrder: ${JSON.stringify(currentOrder)}`)

		const isChanged: boolean = currentOrder.status == Statuses.Inprocess
		const orderStatus = isChanged ? Statuses.Confirmed : currentOrder.status
		let result: Orders
		try {
			result = await this.update(transaction, {
				...order,
				id: order.id,
				status: orderStatus,
				payments: [...order.payments, payment],
			})
			// this.logger.debug(`processTinkoffNotification result order update: ${JSON.stringify(result)}`)
		} catch (error) {
			this.logger.error(error.stack)
			Sentry.captureException(error.stack)
			throw error
		}

		if (payment.status === OrderPaymentStatuses.PAID) {
			this.getOrderEntityAndSendEmail({
				orderId: result.id,
				isCreate: true,
				emailType: EmailType.Create,
			})
		}
	}

	isUserAvailableFullData(user: Users): boolean {
		const forbidReadRoles: Role[] = [Role.SUBCLIENT]

		return !user.roles.some((item) => forbidReadRoles.includes(item.name))
	}

	getWithoutConfidentData(service: Orders, user: Users = undefined) {
		if (user && this.isUserAvailableFullData(user)) {
			return service
		}

		const confidentFields = ['customer', 'price', 'payments', 'user']

		return _.omit(service, confidentFields)
	}

	updatePaymentStatus(dto: UpdateOrderDto) {
		const checkPayments = dto?.payments?.find(
			(payment) => payment.status === OrderPaymentStatuses.PAID,
		)
		const checkProcessPayments = dto?.payments?.find(
			(payment) =>
				payment.method === EPaymentMethod.ONLINE_PAYMENT &&
				payment.status == OrderPaymentStatuses.NOTPAID &&
				payment.createFirstPaymentInBank,
		)
		if (checkPayments) {
			let checkSum = 0
			for (const payment of dto?.payments?.filter(
				(p) => p.status == OrderPaymentStatuses.PAID || p.status == OrderPaymentStatuses.PREPAYMENT,
			)) {
				checkSum += +payment.amount
			}
			dto.paymentStatus =
				checkSum == +dto.price ? OrderPaymentStatuses.PAID : OrderPaymentStatuses.PREPAYMENT
		} else if (checkProcessPayments) {
			dto.paymentStatus = OrderPaymentStatuses.IN_PROCESS
		} else {
			dto.paymentStatus = !dto?.payments?.length
				? OrderPaymentStatuses.WITHOUT_PAYEMNT
				: OrderPaymentStatuses.NOTPAID
		}
	}

	async findOrderCustomer(dto: FindOrderCustomerDto) {
		try {
			return await this.ordersCustomerRepository.find({
				where: {
					phone: In(dto.phones),
				},
			})
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}
}
