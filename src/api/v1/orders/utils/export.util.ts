import { Readable } from 'stream'
import * as xlsx from 'xlsx-js-style'

import {
	AdditionalOrderFieldTitle,
	defaultColumnWidth,
	ExtendedFields,
	OrderFieldTitle,
	OrderPaymentFieldTitle,
	OrderPaymentStatusesToTitle,
	PrepaymentMethodToTitle,
	PrepaymentTypeToTitle,
	StatusesToTitle,
	workSheetColumnNames,
} from '../constants'
import { OrderService } from '../entities/order-service.entity'
import {
	AdditionalOrderDocFields,
	DocWorkSheetNames,
	OrderDocFields,
	OrderPaymentDocFields,
} from '../enums/doc-fields.enums'
import { OrderPriceLib, ServicePriceLib } from 'price-lib'
import { Orders } from '../entities/orders.entity'
import { OrderAdditionalService } from '../entities/order-additional-service.entity'
import { Payments } from '../../payments/entities/payment.entity'
import type { WorkBook, WorkSheet } from 'xlsx-js-style'
import { getHoursAndMinutes } from './date-time.util'
import { FilterStatuses } from '../enums/orders.enums'
import { getDateCell, getHeaderCell, getNumberCell } from './get-cell-object.util'

function exportExcel(workSheetData) {
	const workBook: WorkBook = xlsx.utils.book_new()

	Object.keys(workSheetData).forEach((key) => {
		const workSheet: WorkSheet = xlsx.utils.aoa_to_sheet(workSheetData[key].data)
		workSheet['!cols'] = workSheetData[key].columns
		xlsx.utils.book_append_sheet(workBook, workSheet, workSheetData[key].title)
	})

	return xlsx.write(workBook, {
		bookType: 'xlsx',
		type: 'buffer',
	})
}

function getReadableStream(buffer: Buffer): Readable {
	const stream = new Readable()

	stream.push(buffer)
	stream.push(null)

	return stream
}

function getHeaderFields(source: string[], keyToValueMap: Record<string, string>) {
	const result = []
	source.forEach((key) => {
		const extended = ExtendedFields[key]
		if (extended) {
			extended.forEach((item) => {
				result.push({
					...getHeaderCell(keyToValueMap[item]),
					k: item,
				})
			})
		} else {
			result.push({
				...getHeaderCell(keyToValueMap[key]),
				k: key,
			})
		}
	})
	return result
}

export function exportOrdersToExcel(orders, fields): Readable {
	const orderWorkSheetColumnNames = getHeaderFields(fields, OrderFieldTitle)
	const workSheetData: any = {
		orders: {
			data: [orderWorkSheetColumnNames],
			columns: orderWorkSheetColumnNames.map(() => ({
				wpx: defaultColumnWidth,
			})),
			title: workSheetColumnNames[DocWorkSheetNames.Main],
		},
	}

	const addServicesWorkSheetColumnNames = getHeaderFields(
		Object.keys(AdditionalOrderFieldTitle),
		AdditionalOrderFieldTitle,
	)
	if (addServicesWorkSheetColumnNames.length) {
		workSheetData.services = {
			data: [addServicesWorkSheetColumnNames],
			columns: addServicesWorkSheetColumnNames.map(() => ({
				wpx: defaultColumnWidth,
			})),
			title: workSheetColumnNames[DocWorkSheetNames.AdditionalServices],
		}
	}

	const paymentsWorkSheetColumnNames = getHeaderFields(
		Object.keys(OrderPaymentFieldTitle),
		OrderPaymentFieldTitle,
	)
	if (paymentsWorkSheetColumnNames.length) {
		workSheetData.payments = {
			data: [paymentsWorkSheetColumnNames],
			columns: paymentsWorkSheetColumnNames.map(() => ({
				wpx: defaultColumnWidth,
			})),
			title: workSheetColumnNames[DocWorkSheetNames.Payments],
		}
	}
	orders.forEach((order: Orders) => {
		const priceResult = new OrderPriceLib(order, {
			useTimeZone: true,
			server: true,
		}).calc()
		const start = getHoursAndMinutes(order.dateTimeStart)
		const end = getHoursAndMinutes(order.dateTimeEnd)
		const customer = getCustomer(order)
		const additionalServices = (order.orderServices || [])
			.map((item) => item.additionalServices)
			.flat()
		const preparedOrder = {
			[OrderDocFields.OrderId]: order.id,
			[OrderDocFields.Created]: getDateCell(order.created),
			[OrderDocFields.OrderService]: getServicesTitle(order.orderServices || []),
			[OrderDocFields.SeatsAmount]: order.orderServices
				? order.orderServices.reduce((result, nextItem) => result + nextItem.seatsAmount, 0)
				: null,
			[OrderDocFields.SeatsPrice]: priceResult.placesPrice,
			[OrderDocFields.AdditionalServices]: getAdditionalServicesTitle(additionalServices),
			[OrderDocFields.AdditionalServicesPrice]: priceResult.additionalPrice,
			[OrderDocFields.DateStart]: getDateCell(order.dateTimeStart),
			[OrderDocFields.TimeStart]: `${start}-${end}`,
			[OrderDocFields.Address]: order.address?.country,
			[OrderDocFields.Comment]: order.comment,
			[OrderDocFields.CustomerName]: customer[OrderDocFields.CustomerName],
			[OrderDocFields.CustomerFamilyName]: customer[OrderDocFields.CustomerFamilyName],
			[OrderDocFields.CustomerPhone]: customer[OrderDocFields.CustomerPhone],
			[OrderDocFields.CustomerEmail]: customer[OrderDocFields.CustomerEmail],
			[OrderDocFields.OrderStatus]: getOrderStatus(order),
			[OrderDocFields.PaymentStatus]:
				OrderPaymentStatusesToTitle[order.paymentStatus] || order.paymentStatus,
			[OrderDocFields.OrderPrice]: getNumberCell(
				order.isTechnicalReservation ? 0 : priceResult.fullPrice,
			),
			[OrderDocFields.PrepaymentPrice]: priceResult.prepaymentPrice,
			[OrderDocFields.PaymentBalance]: priceResult.calcPriceWithPayments,
			[OrderDocFields.Worker]: order.user
				? `${order.user.meta.firstName} ${order.user.meta.lastName}`
				: '',
		}

		const result = []
		orderWorkSheetColumnNames.forEach((element) => {
			result.push(preparedOrder[element.k])
		})

		workSheetData.orders.data.push(result)

		if (addServicesWorkSheetColumnNames.length && additionalServices.length) {
			const additionalServicesData = getAdditionalServices(order.id, additionalServices)
			workSheetData.services.data = workSheetData.services.data.concat(additionalServicesData)
		}

		const payments = order.payments || []
		if (paymentsWorkSheetColumnNames.length && payments.length) {
			const paymentsData = getPayments(order.id, payments)
			workSheetData.payments.data = workSheetData.payments.data.concat(paymentsData)
		}
	})
	return getReadableStream(exportExcel(workSheetData))
}

function getOrderStatus(order) {
	if (order.isTechnicalReservation) {
		return StatusesToTitle[FilterStatuses.TechnicalReservation]
	}
	if (order.isCompleted) {
		return StatusesToTitle[FilterStatuses.Completed]
	}
	return StatusesToTitle[order.status] || order.status
}

function getAdditionalServices(orderId, additionalServices) {
	const services = []

	additionalServices.forEach((service: OrderAdditionalService) => {
		const pricedService = new ServicePriceLib(service.service).getPrice({
			count: service.count,
			duration: service.duration,
		})
		const preparedService = {
			[AdditionalOrderDocFields.OrderId]: orderId,
			[AdditionalOrderDocFields.Title]: service.service.title,
			[AdditionalOrderDocFields.Amount]: service.count,
			[AdditionalOrderDocFields.Duration]: service.duration,
			[AdditionalOrderDocFields.Price]: getNumberCell(pricedService?.price),
		}

		const result = []

		Object.keys(AdditionalOrderFieldTitle).forEach((key) => {
			result.push(preparedService[key])
		})

		services.push(result)
	})

	return services
}

function getPayments(orderId, payments) {
	const orderPayments = []
	payments.forEach((payment: Payments) => {
		const preparedPayment = {
			[OrderPaymentDocFields.OrderId]: orderId,
			[OrderPaymentDocFields.PaymentTitle]: PrepaymentTypeToTitle[payment.type] || payment.type,
			[OrderPaymentDocFields.PaymentType]:
				PrepaymentMethodToTitle[payment.method] || payment.method,
			[OrderPaymentDocFields.Price]: getNumberCell(payment.amount),
		}

		const result = []

		Object.keys(OrderPaymentFieldTitle).forEach((key) => {
			result.push(preparedPayment[key])
		})

		orderPayments.push(result)
	})

	return orderPayments
}

function getCustomer(order) {
	const result = {
		[OrderDocFields.CustomerName]: '',
		[OrderDocFields.CustomerFamilyName]: '',
		[OrderDocFields.CustomerPhone]: '',
		[OrderDocFields.CustomerEmail]: '',
	}
	if (order.customer) {
		return {
			[OrderDocFields.CustomerName]: order.customer.meta.firstName,
			[OrderDocFields.CustomerFamilyName]: order.customer.meta.lastName,
			[OrderDocFields.CustomerPhone]: order.customer.phone,
			[OrderDocFields.CustomerEmail]: order.customer.userEmail,
		}
	}
	return result
}

function getServicesTitle(list: OrderService[] = []) {
	return list.map((item) => item.service?.title || '').join(', ')
}

function getAdditionalServicesTitle(list: OrderAdditionalService[] = []) {
	return list.map((item) => item.title || item.service.title || '').join(', ')
}
