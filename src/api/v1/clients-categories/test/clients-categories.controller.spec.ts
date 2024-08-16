import { Test, TestingModule } from '@nestjs/testing'
import { ClientsCategoriesController } from '../clients-categories.controller'
import { ClientsCategoriesService } from '../clients-categories.service'

describe('ClientsCategoriesController', () => {
	let controller: ClientsCategoriesController
	let mockCategory
	let createCategory
	let getCategory
	let updateCategory
	let deleteCategory
	let mockType
	let createType
	let getType
	let getAllTypes
	let updateType
	let deleteType
	let user

	const mockClientsCategoriesService = {
		create: jest.fn((dto) => {
			return { id: 1, ...dto }
		}),
		delete: jest.fn((dto) => 1),
		getOneCategory: jest.fn((dto) => mockCategory),
		getAllCategories: jest.fn(() => [mockCategory]),
		update: jest.fn((dto) => dto),
		createType: jest.fn((dto) => {
			return { id: 1, ...dto }
		}),
		deleteType: jest.fn((dto) => 1),
		getOneCategoryType: jest.fn((dto) => mockType),
		getAllCategoryType: jest.fn(() => [mockType]),
		updateType: jest.fn((dto) => dto),
	}
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClientsCategoriesController],
			providers: [ClientsCategoriesService],
		})
			.overrideProvider(ClientsCategoriesService)
			.useValue(mockClientsCategoriesService)
			.compile()

		mockCategory = {
			id: 1,
			name: 'test cat',
			description: 'any text',
		}
		createCategory = {
			name: mockCategory.name,
			description: mockCategory.description,
		}

		getCategory = {
			id: mockCategory.id,
		}
		updateCategory = mockCategory
		deleteCategory = getCategory

		mockType = {
			id: 1,
			name: 'test type',
			description: 'any text',
		}
		createType = {
			name: mockType.name,
			description: mockType.description,
		}

		getType = {
			id: mockType.id,
		}
		getAllTypes = {
			catIds: [1],
		}
		updateType = createType
		deleteType = getType

		user = {
			user: {
				id: 1,
				userEmail: 'test@test.com',
			},
		}
		controller = module.get<ClientsCategoriesController>(ClientsCategoriesController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should be create client category', async () => {
		expect(await controller.createCat(createCategory)).toEqual({
			id: expect.any(Number),
			name: createCategory.name,
			description: createCategory.description,
		})
	})

	it('should be delete client category', () => {
		expect(controller.deleteCat(deleteCategory)).toBe(1)
	})

	it('should be get one client category', () => {
		expect(controller.getCat(getCategory)).toEqual(mockCategory)
	})

	it('should be get all client categories', () => {
		expect(controller.getAllCats()).toEqual([mockCategory])
	})

	it('should be update client category', async () => {
		const candidate = {
			id: mockCategory.id,
			name: 'new name',
			description: 'new description',
		}
		expect(await controller.updateCat(candidate)).toEqual(candidate)
	})

	it('should be create client category type', async () => {
		expect(await controller.createType(createType)).toEqual({
			id: expect.any(Number),
			...createType,
		})
	})

	it('should be delete client category type', () => {
		expect(controller.deleteType(deleteType)).toBe(1)
	})

	it('should be get one client category type', () => {
		expect(controller.getType(getType)).toEqual(mockType)
	})

	it('should be get all client category types', () => {
		expect(controller.getAllTypes(getCategory)).toEqual([mockType])
	})

	it('should be update client category type', async () => {
		const candidate = {
			id: mockCategory.id,
			name: 'new name',
			description: 'new description',
		}
		expect(await controller.updateType(candidate)).toEqual(candidate)
	})
})
