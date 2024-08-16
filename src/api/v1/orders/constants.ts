import { EPaymentMethod, EPaymentType } from '../payments/enums/payments.enum'
import {
	AdditionalOrderDocFields,
	DocWorkSheetNames,
	OrderDocFields,
	OrderPaymentDocFields,
} from './enums/doc-fields.enums'
import { EmailType } from './enums/email-type.enums'
import { FilterStatuses, OrderPaymentStatuses, Statuses } from './enums/orders.enums'

export const EmailTypeToText = {
	[EmailType.Create]: 'Заказ успешно создан',
	[EmailType.Update]: 'Заказ успешно обновлён',
	[EmailType.Delete]: 'Заказ отменён',
	[EmailType.Failed]: 'Не удалось записаться',
}

export const OperationsAmount: number = 4

export const OrderFieldTitle = {
	[OrderDocFields.OrderId]: 'Заказ',
	[OrderDocFields.Created]: 'Дата создания Заказа',
	[OrderDocFields.OrderService]: 'Услуга',
	[OrderDocFields.SeatsAmount]: 'Количество мест',
	[OrderDocFields.SeatsPrice]: 'Стоимость мест',
	[OrderDocFields.AdditionalServices]: 'Доп.Услуги',
	[OrderDocFields.AdditionalServicesPrice]: 'Стоимость доп. услуг',
	[OrderDocFields.DateStart]: 'Дата оказания услуги',
	[OrderDocFields.TimeStart]: 'Время услуги',
	[OrderDocFields.Address]: 'Адрес',
	[OrderDocFields.Comment]: 'Комментарий Клиента',
	[OrderDocFields.Customer]: 'Клиент',
	[OrderDocFields.CustomerName]: 'Имя Клиента',
	[OrderDocFields.CustomerFamilyName]: 'Фамилия Клиента',
	[OrderDocFields.CustomerPhone]: 'Номер телефона Клиента',
	[OrderDocFields.CustomerEmail]: 'Email Клиента',
	[OrderDocFields.OrderStatus]: 'Статус Заказа',
	[OrderDocFields.PaymentStatus]: 'Статус Оплаты',
	[OrderDocFields.OrderPrice]: 'Стоимость Заказа',
	[OrderDocFields.PrepaymentPrice]: 'Сумма предоплаты',
	[OrderDocFields.PaymentBalance]: 'К оплате по Заказу',
	[OrderDocFields.Worker]: 'Сотрудник',
}

export const AdditionalOrderFieldTitle = {
	[AdditionalOrderDocFields.OrderId]: 'Заказ',
	[AdditionalOrderDocFields.Title]: 'Доп.Услуга',
	[AdditionalOrderDocFields.Amount]: 'Кол-во',
	[AdditionalOrderDocFields.Duration]: 'Длительность',
	[AdditionalOrderDocFields.Price]: 'Стоимость',
}

export const OrderPaymentFieldTitle = {
	[OrderPaymentDocFields.OrderId]: 'Заказ',
	[OrderPaymentDocFields.PaymentTitle]: 'Оплата',
	[OrderPaymentDocFields.PaymentType]: 'Тип оплаты',
	[OrderPaymentDocFields.Price]: 'Сумма',
}

export const DefaultOrderDocFields = [
	OrderDocFields.OrderId,
	OrderDocFields.Created,
	OrderDocFields.OrderService,
	OrderDocFields.AdditionalServices,
	OrderDocFields.TimeStart,
	OrderDocFields.Customer,
	OrderDocFields.Comment,
	OrderDocFields.CustomerEmail,
	OrderDocFields.OrderStatus,
]

export const workSheetColumnNames = {
	[DocWorkSheetNames.Main]: 'Общая',
	[DocWorkSheetNames.AdditionalServices]: 'Дополнительные Услуги',
	[DocWorkSheetNames.Payments]: 'Оплаты',
}

export const OrderFieldWidth = {
	[OrderDocFields.OrderId]: 36,
	[OrderDocFields.Created]: 120,
	[OrderDocFields.OrderService]: 120,
	[OrderDocFields.SeatsAmount]: 120,
	[OrderDocFields.SeatsPrice]: 120,
	[OrderDocFields.AdditionalServices]: 120,
	[OrderDocFields.AdditionalServicesPrice]: 120,
	[OrderDocFields.DateStart]: 120,
	[OrderDocFields.TimeStart]: 120,
	[OrderDocFields.Address]: 120,
	[OrderDocFields.Comment]: 120,
	[OrderDocFields.Customer]: 120,
	[OrderDocFields.CustomerPhone]: 120,
	[OrderDocFields.CustomerEmail]: 120,
	[OrderDocFields.OrderStatus]: 120,
	[OrderDocFields.PaymentStatus]: 120,
	[OrderDocFields.OrderPrice]: 120,
	[OrderDocFields.PrepaymentPrice]: 120,
	[OrderDocFields.PaymentBalance]: 120,
}

export const OrderPaymentStatusesToTitle = {
	[OrderPaymentStatuses.NOTPAID]: 'Не оплачен',
	[OrderPaymentStatuses.PAID]: 'Оплачен',
	[OrderPaymentStatuses.PREPAYMENT]: 'Предоплата',
	[OrderPaymentStatuses.WITHOUT_PAYEMNT]: 'Без оплаты',
	[OrderPaymentStatuses.RETURNED]: 'Сделан возврат',
}

export const StatusesToTitle = {
	[Statuses.Inprocess]: 'В процессе',
	[Statuses.Created]: 'Создан',
	[FilterStatuses.Completed]: 'Завершен',
	[Statuses.Confirmed]: 'Подтвержден',
	[Statuses.Notanswer]: 'Не дозвонились',
	[Statuses.Canceled]: 'Отмена',
	[Statuses.DidNotCome]: 'Клиент не пришел',
	[Statuses.Processed]: 'Обработан',
	[FilterStatuses.TechnicalReservation]: 'Тех. бронь',
}

export const PrepaymentTypeToTitle = {
	[EPaymentType.PREPAYMENT]: 'Предоплата',
	[EPaymentType.SURCHARGE]: 'Доплата',
	[EPaymentType.ADDITIONAL]: 'Дополнительная оплата',
}

export const PrepaymentMethodToTitle = {
	[EPaymentMethod.CASH]: 'Наличные',
	[EPaymentMethod.OTHER]: 'Другое',
	[EPaymentMethod.PAYMENT_ACCOUNT]: 'р/с',
	[EPaymentMethod.TERMINAL]: 'Терминал',
}

export const ExtendedFields = {
	[OrderDocFields.TimeStart]: [OrderDocFields.DateStart, OrderDocFields.TimeStart],
	[OrderDocFields.Customer]: [OrderDocFields.CustomerName, OrderDocFields.CustomerFamilyName],
}

export const defaultColumnWidth: number = 120
