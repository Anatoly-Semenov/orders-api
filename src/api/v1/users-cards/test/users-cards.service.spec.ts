import { Test, TestingModule } from '@nestjs/testing'
import { UsersCardsService } from '../users-cards.service'

describe('UsersCardsService', () => {
	let service: UsersCardsService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersCardsService],
		}).compile()

		service = module.get<UsersCardsService>(UsersCardsService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
