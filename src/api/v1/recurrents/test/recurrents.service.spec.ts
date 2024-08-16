import { Test, TestingModule } from '@nestjs/testing'
import { RecurrentsService } from '../recurrents.service'

describe('RecurrentsService', () => {
	let service: RecurrentsService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RecurrentsService],
		}).compile()

		service = module.get<RecurrentsService>(RecurrentsService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
