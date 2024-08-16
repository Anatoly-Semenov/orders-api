export class DeletePaymentQueueDto {
	paymentId: number

	constructor(partial?: Partial<DeletePaymentQueueDto>) {
		if (partial) {
			Object.assign(this, partial)
		}
	}
}
