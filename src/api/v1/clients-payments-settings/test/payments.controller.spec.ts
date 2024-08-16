import { Test, TestingModule } from '@nestjs/testing'
import { ClientPaymentsSettingsController } from '../client-payments-settings.controller'
import { ClientPaymentsSettingsService } from '../client-payments-settings.service'

describe('Payment controller test:', () => {
	let controller: ClientPaymentsSettingsController
	let paymentMock
	let user
	const mockClientPaymentsSettingsService = {
		create: jest.fn((dto) => {
			return {
				id: Date.now(),
				...dto,
			}
		}),
		delete: jest.fn((dto) => {
			return 1
		}),
		update: jest.fn((dto) => {
			return {
				...dto,
				id: Date.now(),
			}
		}),
		getOne: jest.fn((dto) => paymentMock),
		getAll: jest.fn((dto) => [paymentMock]),
	}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClientPaymentsSettingsController],
			providers: [ClientPaymentsSettingsService],
		})
			.overrideProvider(ClientPaymentsSettingsService)
			.useValue(mockClientPaymentsSettingsService)
			.compile()

		paymentMock = {
			appId: 29,
			delay: '60',
			taxAccount: false,
			currency: 'RUB',
			methods: [
				{
					name: 'string',
					meta: [
						{
							methodName: 'string',
							key: 'string',
							value: 'string',
						},
					],
				},
			],
		}
		user = {
			user: {
				id: Date.now(),
			},
		}
		controller = module.get<ClientPaymentsSettingsController>(ClientPaymentsSettingsController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should be create payment', async () => {
		expect(await controller.create(paymentMock)).toEqual({
			id: expect.any(Number),
			...paymentMock,
		})
	})

	it('should be update payment', async () => {
		expect(await controller.update(paymentMock)).toEqual({
			...paymentMock,
			id: expect.any(Number),
		})
	})

	it('should be delete payment', () => {
		expect(controller.delete(paymentMock)).toBe(1)
	})

	it('should be get one payment', () => {
		expect(controller.getOne({ paymentId: paymentMock.id })).toEqual(paymentMock)
	})

	it('should be get all payments', () => {
		expect(controller.getAll({ appId: 1 })).toEqual([paymentMock])
	})
})
