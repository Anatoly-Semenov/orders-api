export enum OrderDocFields {
	OrderId = 'id',
	Created = 'dateTimeStart',
	OrderService = 'orderServices',
	SeatsAmount = 'seatsCount',
	SeatsPrice = 'seatsPrice',
	AdditionalServices = 'additionalServices',
	AdditionalServicesPrice = 'additionalServicesPrice',
	DateTimeStart = 'dateTimeStart',
	DateStart = 'dateStart',
	TimeStart = 'duration',
	Address = 'address',
	Comment = 'comment',
	Customer = 'customerName',
	CustomerName = 'customerName',
	CustomerFamilyName = 'customerFamilyName',
	CustomerPhone = 'customerPhone',
	CustomerEmail = 'customerEmail',
	OrderStatus = 'orderStatus',
	PaymentStatus = 'paymentStatus',
	OrderPrice = 'price',
	PrepaymentPrice = 'prepaymentPrice',
	PaymentBalance = 'paymentBalance',
	Worker = 'worker',
}

export enum AdditionalOrderDocFields {
	OrderId = 'id',
	Title = 'title',
	Amount = 'amount',
	Duration = 'additionalServiceDuration',
	Price = 'price',
}

export enum OrderPaymentDocFields {
	OrderId = 'id',
	PaymentTitle = 'paymentTitle',
	PaymentType = 'paymentType',
	Price = 'price',
}

export enum DocWorkSheetNames {
	Main = 'order',
	AdditionalServices = 'services',
	Payments = 'payments',
}
