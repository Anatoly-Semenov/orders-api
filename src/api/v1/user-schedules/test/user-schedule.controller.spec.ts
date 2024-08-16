import { Test, TestingModule } from '@nestjs/testing'
import { UserScheduleController } from '../user-schedule.controller'
import { UserScheduleService } from '../user-schedule.service'

describe('UserSchedule controller test:', () => {
	let controller: UserScheduleController
	let userScheduleMock
	let user
	const mockUserScheduleService = {
		create: jest.fn((dto) => {
			return {
				id: Date.now(),
				...dto,
			}
		}),
		createMany: jest.fn((dto) => {
			return [
				{
					id: Date.now(),
					...userScheduleMock,
				},
			]
		}),
		delete: jest.fn((dto) => {
			return 1
		}),
		clone: jest.fn((dto) => {
			return {
				id: Date.now(),
				...dto,
			}
		}),
		update: jest.fn((dto) => dto),
		get: jest.fn((dto) => {
			return [dto]
		}),
	}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserScheduleController],
			providers: [UserScheduleService],
		})
			.overrideProvider(UserScheduleService)
			.useValue(mockUserScheduleService)
			.compile()

		userScheduleMock = {
			dateTimeStart: '2021-08-31 12:00:00',
			dateTimeEnd: '2021-08-31 13:00:00',
			timezone: 'Europe/Moscow',
			userId: 1,
		}
		user = {
			user: {
				id: 1,
			},
		}
		controller = module.get<UserScheduleController>(UserScheduleController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should be create user schedule', async () => {
		expect(await controller.create(userScheduleMock)).toEqual({
			id: expect.any(Number),
			...userScheduleMock,
		})
	})

	it('should be create many schedules', () => {
		expect(controller.createMany({ items: [userScheduleMock] })).toEqual([
			{
				id: expect.any(Number),
				...userScheduleMock,
			},
		])
	})

	it('should be clone schedule', async () => {
		expect(await controller.clone(userScheduleMock)).toEqual({
			id: expect.any(Number),
			...userScheduleMock,
		})
	})

	it('should be get all schedules', () => {
		userScheduleMock.id = 1
		expect(controller.get(userScheduleMock)).toEqual([
			{
				id: expect.any(Number),
				...userScheduleMock,
			},
		])
	})

	it('should be update schedule', async () => {
		userScheduleMock.id = 1
		expect(await controller.update(userScheduleMock)).toEqual({
			id: expect.any(Number),
			...userScheduleMock,
		})
	})
})
