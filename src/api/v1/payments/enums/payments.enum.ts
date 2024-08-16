export enum Currency {
	RUB = 'rub',
	USD = 'usd',
	EUR = 'eur',
}
export enum Language {
	RU = 'ru',
	EN = 'en',
}
export enum EPaymentProvider {
	TINKOFF = 'tinkoff',
	STRIP = 'stripe',
}

export enum EPayment {
	TINKOFF = 'tinkoff',
	STRIP = 'stripe',
}

export enum EPaymentMethod {
	CASH = 'cash',
	TERMINAL = 'terminal',
	PAYMENT_ACCOUNT = 'paymentAccount',
	OTHER = 'other',
	ONLINE_PAYMENT = 'onlinePayment',
}

export enum EPaymentType {
	PREPAYMENT = 'prepayment',
	SURCHARGE = 'surcharge',
	ADDITIONAL = 'additional',
}
