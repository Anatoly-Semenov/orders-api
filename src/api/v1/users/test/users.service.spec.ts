import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { HttpModule, HttpService } from '@nestjs/axios'
import { Users } from '../entities/users.entity'
import { UsersService } from '../users.service'
import { UsersMeta } from '../entities/users-meta.entity'
import { Clients } from '../../clients/entities/clients.entity'
import { NotificationsService } from 'src/utils/notifications/notifications.service'
import { Notifications } from 'src/utils/notifications/entities/notification.entity'

describe('UsersService', () => {
	let service: UsersService
	let httpService: HttpService
	let notificationsService: NotificationsService
	let userDto
	const mockSubscriberService = {}
	const mockUsersRepository = {
		findOne: jest.fn((dto) => {
			return userDto
		}),
	}
	const mockUsersMetaRepository = {}
	const mockClientsRepository = {}
	const mockNotificationsRepository = {}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			providers: [
				UsersService,
				NotificationsService,
				{
					provide: 'SUBSCRIBERS_SERVICE',
					useValue: mockSubscriberService,
				},
				{
					provide: getRepositoryToken(Users),
					useValue: mockUsersRepository,
				},
				{
					provide: getRepositoryToken(UsersMeta),
					useValue: mockUsersMetaRepository,
				},
				{
					provide: getRepositoryToken(Clients),
					useValue: mockClientsRepository,
				},
				{
					provide: getRepositoryToken(Notifications),
					useValue: mockNotificationsRepository,
				},
			],
		}).compile()

		userDto = {
			id: Date.now(),
			userEmail: 'test@service.com',
			userPassword: 'Teaspassword',
			meta: [
				{
					key: 'firstname',
					value: 'test',
				},
				{
					key: 'lastname',
					value: 'test',
				},
			],
			role: {
				id: 1,
				name: 'client',
			},
		}

		service = module.get<UsersService>(UsersService)
		httpService = module.get<HttpService>(HttpService)
		notificationsService = module.get<NotificationsService>(NotificationsService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should be create password', async () => {
		return service.generatePwd(userDto.userPassword).then((result) => {
			expect(result).toEqual({
				final: expect.any(String),
				clear: expect.stringMatching(userDto.userPassword),
			})
		})
	})

	it('should be check user by id', async () => {
		return await service.checkUser({ id: userDto.id }).then((result) => {
			expect(result).toEqual(userDto)
		})
	})

	it('should be check user by userEmail', async () => {
		return service.checkUser({ userEmail: userDto.userEmail }).then((result) => {
			expect(result).toEqual(userDto)
		})
	})
})
