import { HttpModule, HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Clients } from '../../clients/entities/clients.entity'
import { UsersService } from '../../users/users.service'
import { PaymentsService } from '../payments.service'

describe('PaymentsService', () => {
	let service: PaymentsService
	let httpService: HttpService
	let mockPayment
	let mockClientApp
	const mockClientsRepository = {
		findOne: jest.fn((dto) => mockClientApp),
	}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			providers: [
				PaymentsService,
				{
					provide: getRepositoryToken(Clients),
					useValue: mockClientsRepository,
				},
			],
		}).compile()

		mockPayment = {
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
		mockClientApp = {
			id: 1,
			payment: {
				methods: [
					{
						name: 'cloudpayment',
						meta: [
							{
								key: 'publicId',
								value: Date.now(),
							},
							{
								key: 'secretKey',
								value: '' + Date.now(),
							},
						],
					},
				],
			},
		}
		service = module.get<PaymentsService>(PaymentsService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should be check app', async () => {
		return service.checkApp(mockPayment, 'cloudpayment').then((result) => {
			expect(result).toEqual({
				publicId: expect.any(Number),
				secretKey: expect.any(String),
			})
		})
	})
})
