import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Users } from '../../users/entities/users.entity'
import { NotificationsService } from 'src/utils/notifications/notifications.service'
import { ClientsMeta } from '../entities/clients-meta.entity'
import { Clients } from '../entities/clients.entity'
import { ClientsService } from '../clients.service'
import { HttpModule, HttpService } from '@nestjs/axios'
import { Notifications } from 'src/utils/notifications/entities/notification.entity'

describe('ClientService', () => {
	let service: ClientsService
	let mockClient
	let mockUser

	const mockClientsRepository = {
		findOne: jest.fn((dto) => mockClient),
		delete: jest.fn((dto) => 1),
	}
	const mockUsersRepository = {}
	const mockClientsMetaRepository = {}
	const mockNotificationsRepository = {}
	const mockSubscriberService = {}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			providers: [
				ClientsService,
				NotificationsService,
				{
					provide: 'SUBSCRIBERS_SERVICE',
					useValue: mockSubscriberService,
				},
				{
					provide: getRepositoryToken(Clients),
					useValue: mockClientsRepository,
				},
				{
					provide: getRepositoryToken(Users),
					useValue: mockUsersRepository,
				},
				{
					provide: getRepositoryToken(ClientsMeta),
					useValue: mockClientsMetaRepository,
				},
				{
					provide: getRepositoryToken(Notifications),
					useValue: mockNotificationsRepository,
				},
			],
		}).compile()

		mockClient = {
			userId: 1,
			clientName: 'string',
			clientUrl: 'strsisssg.ru',
			isActive: false,
			istest: false,
			meta: [
				{
					key: 'type',
					value: 'rent',
					id: 26,
				},
			],
			secretKey: 'pb$2b$13$GVs1wG1Puf7SMrUS8XLk4.BGcpmIFfXrPUC6s9OAZqJlpAQY8iQVq',
			testSecretKey: 'test$2b$13$KumsauLkmvBtM2y6G.CMP.La6Y8reldDybVHWcUyRHWla0y8bBsVu',
			users: [mockUser],
			id: 1,
			isTest: false,
		}
		service = module.get<ClientsService>(ClientsService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	// clientValidate
	it('should be client validate by add and secret key', async () => {
		expect(
			await service.clientValidate({
				username: mockClient.id,
				password: mockClient.secretKey,
			}),
		).toBeTruthy()
	})

	// createKeys
	it('should be create test and public keys', async () => {
		expect(await service.createKeys()).toEqual({
			secretKey: expect.any(String),
			testSecretKey: expect.any(String),
		})
	})
})
