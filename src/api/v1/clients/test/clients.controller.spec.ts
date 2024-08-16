import { Test, TestingModule } from '@nestjs/testing'
import { ClientsController } from '../clients.controller'
import { ClientsService } from '../clients.service'

describe('ClientsController', () => {
	let controller: ClientsController
	const mockClientsService = {
		create: jest.fn((dto) => dto),

		delete: jest.fn((dto) => 1),
		update: jest.fn((dto) => {
			return {
				...dto,
				meta: [
					{
						id: 25,
						key: 'type',
						value: 'timerend',
					},
				],
			}
		}),
		clone: jest.fn((dto) => {
			return {
				...dto,
				id: Date.now(),
			}
		}),
		getOne: jest.fn((dto) => mockClient),
		getAll: jest.fn((dto) => [mockClient]),
	}
	let mockClient
	let mockUser
	let user

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClientsController],
			providers: [ClientsService],
		})
			.overrideProvider(ClientsService)
			.useValue(mockClientsService)
			.compile()

		mockUser = {
			id: 1,
			userEmail: 'test@user.ru',
			userPassword: 'testPass',
			isActive: false,
			meta: [
				{
					key: 'firstname',
					value: 'TestUser',
				},
			],
			role: {
				id: 1,
				name: 'client',
			},
		}
		user = {
			user: {
				id: mockUser.id,
				userEmail: mockUser.userEmail,
			},
		}
		mockClient = {
			id: 1,
			clientName: 'string',
			clientUrl: 'strsisssg.ru',
			secretKey: 'pb$2b$13$1HAroovP9zqM8Ro5F/KSgupThF1zXU.THsD6J8v1/aeUOWlBTixfC',
			testSecretKey: 'test$2b$13$PiZKpCC4KWsdl7l7xCibwOtcIMKUN70hcJ8PNaIDzyMUUpReNb6hG',
			isActive: false,
			isTest: false,
			photos: [],
			users: [
				{
					id: mockUser.id,
					userEmail: 'ihoum43@gmail.com',
					userPassword: '$2b$13$KGcaGFqJyuNp6L6HhV8NHeCyIHeWyjIRe7F6kJ1FewYr3ObQhgmZS',
					isActive: false,
				},
			],
			meta: [
				{
					id: 25,
					key: 'type',
					value: 'rent',
				},
			],
		}

		controller = module.get<ClientsController>(ClientsController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	// Create app
	it('should be create client app', async () => {
		expect(await controller.create(undefined, mockClient)).toEqual(mockClient)
	})

	// find all
	it('should be retrun all apps', () => {
		expect(controller.getAll({ userId: null })).toEqual([mockClient])
	})

	// find one
	it('should be retrun app by id', () => {
		expect(controller.getOne({ appId: mockClient.id, userId: user.user.id })).toEqual({
			...mockClient,
			id: expect.any(Number),
		})
	})

	// clone app
	it('should be clone client app', async () => {
		expect(await controller.clone(mockClient)).toEqual({
			...mockClient,
			id: expect.any(Number),
		})
	})

	// remove app
	it('should be delete client app', () => {
		expect(controller.delete(mockClient)).toBe(1)
	})

	// upadte app
	it('should be update user', async () => {
		expect(await controller.update(mockClient)).toEqual({
			...mockClient,
			meta: [
				{
					id: expect.any(Number),
					key: expect.any(String),
					value: expect.any(String),
				},
			],
		})
	})
})
