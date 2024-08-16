import { Test, TestingModule } from '@nestjs/testing'
import { UsersCardsController } from '../users-cards.controller'
import { UsersCardsService } from '../users-cards.service'

describe('UsersCardsController', () => {
	let controller: UsersCardsController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersCardsController],
			providers: [UsersCardsService],
		}).compile()

		controller = module.get<UsersCardsController>(UsersCardsController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
