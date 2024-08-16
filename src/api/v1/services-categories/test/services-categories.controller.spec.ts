import { Test, TestingModule } from '@nestjs/testing'
import { ServicesCategoriesController } from '../services-categories.controller'
import { ServicesCategoriesService } from '../services-categories.service'

describe('ServicesCategories controller test:', () => {
	let controller: ServicesCategoriesController
	let servicesCategoryMock
	let user
	const mockServicesCategoriesService = {
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
					...servicesCategoryMock,
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
		getOne: jest.fn((dto) => {
			return dto
		}),
	}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ServicesCategoriesController],
			providers: [ServicesCategoriesService],
		})
			.overrideProvider(ServicesCategoriesService)
			.useValue(mockServicesCategoriesService)
			.compile()

		servicesCategoryMock = {
			name: 'Test category',
		}
		user = {
			user: {
				id: 1,
			},
		}
		controller = module.get<ServicesCategoriesController>(ServicesCategoriesController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should be create category', async () => {
		expect(await controller.create(servicesCategoryMock)).toEqual({
			id: expect.any(Number),
			...servicesCategoryMock,
		})
	})

	it('should be get category', () => {
		servicesCategoryMock.id = 1
		expect(controller.getOne(servicesCategoryMock)).toEqual({
			id: expect.any(Number),
			...servicesCategoryMock,
		})
	})

	it('should be update category', async () => {
		servicesCategoryMock.id = 1
		expect(await controller.update(servicesCategoryMock)).toEqual({
			id: expect.any(Number),
			...servicesCategoryMock,
		})
	})

	it('should be delete category', () => {
		servicesCategoryMock.id = 1
		expect(controller.delete(servicesCategoryMock)).toBe(1)
	})
})
