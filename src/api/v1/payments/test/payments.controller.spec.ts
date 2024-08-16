import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsController } from '../payments.controller'
import { PaymentsService } from '../payments.service'

describe('PaymentsController', () => {
	let controller: PaymentsController
	let paymentMock
	const mockPaymentsService = {
		cloudpaymentPaymentCreate: jest.fn((dto) => {
			return {}
		}),
		cloudpaymentPaymentCancel: jest.fn((dto) => {
			return { Success: true, Message: null }
		}),
		cloudpaymentPaymentRefund: jest.fn((dto) => {
			return {
				Model: {
					TransactionId: 568,
				},
				Success: true,
				Message: null,
			}
		}),
	}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PaymentsController],
			providers: [PaymentsService],
		})
			.overrideProvider(PaymentsService)
			.useValue(mockPaymentsService)
			.compile()

		paymentMock = {
			Amount: 100,
			Currency: 'RUB',
			Name: 'IVAN MIKHEEV',
			InvoiceId: 1234,
			Description: 'SOME TEXT',
			CultureName: '',
			Email: 'ihoum43@gmail.com',
			Payer: {
				firstName: 'Ivan',
				lastName: 'Mikheev',
			},
			appId: 1,
		}
		controller = module.get<PaymentsController>(PaymentsController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should be create payment in cloudpayment', async () => {
		expect(await controller.cloudpaymentCreate(paymentMock)).toEqual({})
	})

	it('should be cancel payment from cloudpayment', async () => {
		const cancelPaymentMock = {
			TransactionId: 1,
		}
		expect(await controller.cloudpaymentCancel(cancelPaymentMock)).toEqual({
			Success: expect.any(Boolean),
			Message: null,
		})
	})

	it('should be refund payment from cloudpayment', async () => {
		const refuncPaymentsMock = { TransactionId: 455, Amount: 100 }
		expect(await controller.cloudpaymentRefund(refuncPaymentsMock)).toEqual({
			Model: {
				TransactionId: expect.any(Number),
			},
			Success: expect.any(Boolean),
			Message: null,
		})
	})
})
