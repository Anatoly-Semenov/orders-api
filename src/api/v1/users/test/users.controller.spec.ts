import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'

describe('User controller test:', () => {
	let controller: UsersController
	let userMock
	let user
	const mockSubscriberService = {}
	const mockUsersService = {
		create: jest.fn((dto) => {
			return {
				id: Date.now(),
				...dto,
			}
		}),
		delete: jest.fn((dto) => {
			return 1
		}),
		clone: jest.fn((dto) => {
			return {
				...dto,
				id: Date.now(),
			}
		}),
		update: jest.fn((dto) => {
			if (!dto.userPassword) {
				dto.userPassword = Date.now()
			}
			return {
				...dto,
				meta: [
					{
						key: 'firstname',
						value: 'TestUser',
					},
				],
			}
		}),
		forgotPassword: jest.fn(async (dto) => {
			try {
				return {
					accepted: ['ihoum43@gmail.com'],
					rejected: [],
					envelopeTime: 58,
					messageTime: 379,
					messageSize: 334,
					response:
						'250 2.0.0 Ok: queued on vla5-445dc1c4c112.qloud-c.yandex.net as 1626807290-H9I3Z0YL1S-so3qUqBj',
					envelope: {
						from: 'vivalavanya@yandex.ru',
						to: ['ihoum43@gmail.com'],
					},
					messageId: '<b4b8b666-3a4a-023f-7224-b104406b5fbe@yandex.ru>',
				}
			} catch (error) {
				return error
			}
		}),
	}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService],
		})
			.overrideProvider(UsersService)
			.useValue(mockUsersService)
			.overrideProvider('SUBSCRIBERSSERVICE')
			.useValue(mockSubscriberService)
			.compile()

		userMock = {
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
				id: userMock.id,
			},
		}
		controller = module.get<UsersController>(UsersController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should be create user', async () => {
		expect(await controller.create(userMock)).toEqual({
			id: expect.any(Number),
			...userMock,
		})
	})

	it('should be delete user', () => {
		expect(controller.remove(userMock)).toEqual(userMock.id)
	})

	it('should be send email for password replacement', () => {
		return controller.forgotPassword(userMock).then((result) => {
			expect(result).toBeInstanceOf(Object)
			expect(result).toEqual({
				...result,
				accepted: expect.any(Array),
				envelope: {
					from: expect.any(String),
					to: expect.any(Array),
				},
			})
		})
	})

	it('should be not send email to change password if qpb notification microservice is disabled', () => {
		return controller.forgotPassword(userMock).catch((error) => {
			expect(error).toBeInstanceOf(Error)
		})
	})

	it('should be update user without pass', async () => {
		const userupdate = userMock
		delete userupdate.userPassword
		expect(await controller.update(userupdate)).toEqual({
			...userMock,
		})
	})

	it('should be update user', async () => {
		expect(await controller.update(userMock)).toEqual({
			...userMock,
		})
	})

	it('should be clone user', async () => {
		expect(await controller.clone(userMock)).toEqual({
			...userMock,
			id: expect.any(Number),
		})
	})
})
