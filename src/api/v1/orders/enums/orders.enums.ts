export enum SaleTypes {
	Percent = 'percent',
	Amount = 'amount',
}

export enum Statuses {
	Inprocess = 'inprocess',
	Created = 'created',
	Confirmed = 'confirmed',
	Notanswer = 'noAnswer',
	Canceled = 'canceled',
	Paid = 'paid',
	Processed = 'processed',
	Returned = 'returned',
	DidNotCome = 'didNotCome',
}

export enum FilterStatuses {
	Inprocess = 'inprocess',
	Created = 'created',
	Completed = 'completed',
	TechnicalReservation = 'technicalReservation',
	Confirmed = 'confirmed',
	Notanswer = 'noAnswer',
	Canceled = 'canceled',
	Paid = 'paid',
	Processed = 'processed',
	Returned = 'returned',
	DidNotCome = 'didNotCome',
}

export enum EOrderSource {
	SUBCLIENT = 'subclient',
	PLATFORM = 'platform',
}
export enum EOrderFilterOrderField {
	ID = 'id',
	DATETIEMSTART = 'dateTimeStart',
	DATETIEMEND = 'dateTimeEnd',
	CREATED = 'created',
}

export enum OrderPaymentStatuses {
	IN_PROCESS = 'inProcess',
	NOTPAID = 'notPaid',
	PAID = 'paid',
	PREPAYMENT = 'prepayment',
	CANCEL = 'cancel',
	RETURNED = 'returned',
	REJECTED = 'rejected',
	PART_RETURNED = 'partReturned',
	WITHOUT_PAYEMNT = 'withoutPayment',
}
