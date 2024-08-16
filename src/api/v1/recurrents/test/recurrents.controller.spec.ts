import { Test, TestingModule } from '@nestjs/testing'
import { RecurrentsController } from '../recurrents.controller'
import { RecurrentsService } from '../recurrents.service'

describe('RecurrentsController', () => {
	let controller: RecurrentsController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RecurrentsController],
			providers: [RecurrentsService],
		}).compile()

		controller = module.get<RecurrentsController>(RecurrentsController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
