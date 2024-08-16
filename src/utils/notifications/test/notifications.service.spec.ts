import { HttpModule, HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Notifications } from '../entities/notification.entity'
import { NotificationsService } from '../notifications.service'
import { createUserEmail } from '../notifications/emails'

describe('NotificationsService', () => {
	let service: NotificationsService
	let httpService: HttpService
	const mockNotificationsRepository = {}
	const mockSubscriberService = {}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			providers: [
				NotificationsService,
				{
					provide: 'SUBSCRIBERS_SERVICE',
					useValue: mockSubscriberService,
				},
				{
					provide: getRepositoryToken(Notifications),
					useValue: mockNotificationsRepository,
				},
			],
		}).compile()

		service = module.get<NotificationsService>(NotificationsService)
		httpService = module.get<HttpService>(HttpService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should be create email', async () => {
		expect(
			await service.createEmail('test@email.com', await createUserEmail({ password: 'anytext' }), {
				subject: 'Test email',
			}),
		).toEqual({
			authorization: expect.any(Object),
			childs: expect.any(Array),
			fromEmail: expect.any(String),
			subjectEmail: expect.any(String),
			toEmail: expect.any(String),
		})
	})
})
