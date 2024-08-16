import { Test, TestingModule } from '@nestjs/testing'
import { NotificationsController } from '../notifications.controller'
import { NotificationsService } from '../notifications.service'

describe('NotificationsController', () => {
	let controller: NotificationsController
	let mockNotification
	let createNotification
	let getOneNotification
	let getAllNotification
	let updateNotification
	let deleteNotification
	let user

	const mockNotificationsService = {
		create: jest.fn((dto) => {
			return { id: 1, ...dto }
		}),
		delete: jest.fn((dto) => 1),
		update: jest.fn((dto) => dto),
		getOne: jest.fn((dto) => mockNotification),
		getAll: jest.fn((dto) => [mockNotification]),
	}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotificationsController],
			providers: [NotificationsService],
		})
			.overrideProvider(NotificationsService)
			.useValue(mockNotificationsService)
			.compile()
		mockNotification = {
			id: 1,
			customText: 'any cat',
			type: 'createClient',
			appId: 1,
		}
		createNotification = {
			name: mockNotification.name,
			description: mockNotification.description,
		}

		getOneNotification = {
			id: mockNotification.id,
		}

		getAllNotification = {
			appId: 1,
		}
		updateNotification = mockNotification
		deleteNotification = getOneNotification

		user = {
			user: {
				id: 1,
				userEmail: 'test@test.com',
			},
		}
		controller = module.get<NotificationsController>(NotificationsController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should be create notification', async () => {
		expect(await controller.create(createNotification)).toEqual({
			id: expect.any(Number),
			...createNotification,
		})
	})

	it('should be delete notification', () => {
		expect(controller.delete(deleteNotification)).toBe(1)
	})

	it('should be get one notification', () => {
		expect(controller.getOne(getOneNotification)).toEqual(mockNotification)
	})

	it('should be get all notification', () => {
		expect(controller.getAll(getAllNotification)).toEqual([mockNotification])
	})

	it('should be update notification', async () => {
		const candidate = {
			id: mockNotification.id,
			customText: 'new name',
			type: 'approveBooking',
			appId: 1,
		}
		expect(await controller.update(candidate)).toEqual(candidate)
	})
})
