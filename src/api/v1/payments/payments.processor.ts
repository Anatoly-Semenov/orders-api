import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { forwardRef, Inject, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render, OrderCreate, OrderMail } from 'svelte-emaileo'
import { Job } from 'bull'

import { checkExpiredLinkProcessName } from './constants'
import { PaymentsService } from './payments.service'
import { OrderPaymentStatuses } from '../orders/enums/orders.enums'
import { Orders } from '../orders/entities/orders.entity'
import { TinkoffPaymentService } from './services/tinkoff/tinkoff-payment.service'
import { OrderManager } from 'src/utils/OrderManager/OrderManager'
import { Clients } from '../clients/entities/clients.entity'
import { OrdersService } from '../orders/orders.service'
import { EmailTypeToText } from '../orders/constants'
import { NotificationsService } from 'src/utils/notifications/notifications.service'
import { SendEmailHtmlDto } from 'src/utils/notifications/dto/send-email-html.dto'
import { EmailType } from '../orders/enums/email-type.enums'
import { DeletePaymentQueueDto } from './dto/payment/delete-payment-queue.dto'

// Types
enum Email {
	CUSTOMER = 'customer',
	COMPANY = 'company',
}

@Processor('payments')
export class PaymentsProcessor {
	private readonly logger = new Logger('Delete payment consumer')

	constructor(
		private readonly paymentsService: PaymentsService,

		private readonly tinkoffPaymentService: TinkoffPaymentService,

		private readonly notificationService: NotificationsService,

		private readonly configService: ConfigService,

		@Inject(forwardRef(() => OrdersService))
		private readonly ordersService: OrdersService,
	) {}

	@Process({ name: checkExpiredLinkProcessName })
	async handleDeletePayment(job: Job<DeletePaymentQueueDto>): Promise<void> {
		const { paymentId } = job.data

		const payment = await this.paymentsService.findOne(paymentId, ['order', 'order.client'])

		const order: Orders = payment?.order
		const orderId: number = order?.id || 0
		const canDelete: boolean = !!(
			payment?.status === OrderPaymentStatuses.NOTPAID &&
			orderId &&
			order
		)

		if (canDelete) {
			await this.deleteOrder(orderId)

			await this.sendEmail(order)
		}
	}

	@OnQueueFailed({ name: checkExpiredLinkProcessName })
	async failedDeletePayment(job: Job<DeletePaymentQueueDto>): Promise<void> {
		const { paymentId } = job.data

		this.logger.error(`Task to delete payment is failed. payment id: ${paymentId}`)
	}

	async deleteOrder(id: number): Promise<void> {
		if (id) {
			try {
				await this.ordersService.delete(id, false)
			} catch (error) {
				this.logger.error(`Failed to delete order with id ${id};\n ${error}`)
			}
		} else {
			this.logger.error(`Failed to delete order with id ${id}`)
		}
	}

	generateEmailData(orderData: Orders, type: Email): SendEmailHtmlDto {
		const order: Orders = new OrderManager<Orders>(orderData).applyTimezone()
		const company: Clients = order.client

		const companyEmail: string = company.meta.email
		const customerEmail: string = order.customer.userEmail

		const emailType = type === Email.COMPANY ? 'error' : 'payError'
		const htmlGenerator = type === Email.COMPANY ? OrderCreate : OrderMail

		const html: string = render(htmlGenerator, { order, company, type: emailType })
		const name: string = company?.clientName || ''
		const to = type === Email.COMPANY ? companyEmail : customerEmail
		const subject = EmailTypeToText[EmailType.Failed]

		return { html, name, to, subject }
	}

	async sendEmail(order: Orders): Promise<void> {
		const customerEmailData: SendEmailHtmlDto = this.generateEmailData(order, Email.CUSTOMER)
		const companyEmailData: SendEmailHtmlDto = this.generateEmailData(order, Email.COMPANY)

		await this.notificationService.sendEmailHtml(customerEmailData)
		await this.notificationService.sendEmailHtml(companyEmailData)
	}
}
