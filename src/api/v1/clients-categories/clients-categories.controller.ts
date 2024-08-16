import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiExcludeEndpoint,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { Role } from '../users/enums/user-roles.enum'
import { ClientsCategoriesService } from './clients-categories.service'
import { CreateClientsCategoriesTypesDto } from './dto/create-clients-categories-types.dto'
import { CreateClientsCategoriesDto } from './dto/create-clients-categories.dto'
import { DeleteClientsCategoriesDto } from './dto/delete-clients-categories.dto'
import { DeleteOneClientsCategoriesTypesDto } from './dto/delete-one-clients-categories-types.dto'
import { EnableClientsCategoriesDto } from './dto/enable-client-category.dto'
import { EnableClientsCategoriesTypesDto } from './dto/enable-client-category-types.dto'
import { GetAllClientsCategoriesTypeDto } from './dto/get-all-clients-categories-types.dto'
import { GetOneClientsCategoriesTypeDto } from './dto/get-one-clients-categoires-type.dto'
import { GetOneClientsCategoriesDto } from './dto/get-one-clients-categories.dto'
import { UpdateClientsCategoriesTypesDto } from './dto/update-clients-categoires-types.dto'
import { UpdateClientsCategoriesDto } from './dto/update-clients-categories.dto'
import { ClientsCategoriesTypes } from './entities/clients-categories-types.entity'
import { ClientsCategories } from './entities/clients-categories.entity'
import {
	FilterClientsCategoriesDto,
	FilterClientsTypesDto,
} from './dto/filter-clientcategories.dto'
import { ThrowError } from 'src/decorators/ThrowError.decorator'

@ApiTags('Категории и типы компании')
@Controller('clients-categories')
export class ClientsCategoriesController {
	constructor(private readonly clientsCategoriesService: ClientsCategoriesService) {}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-category',
		summary: 'Создать категорию',
		description:
			'Создает новую категорию компании. Создать категорию может только OWNERADMIN и OWNERMANAGER',
	})
	@ApiResponse({
		type: CreateClientsCategoriesDto,
		status: 201,
		description: 'Вернет созданный объект категории',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет полномочий доступа',
	})
	@ApiResponse({
		status: 401,
		description: 'Пользователь не авторизован',
	})
	@ApiBody({
		type: CreateClientsCategoriesDto,
		required: true,
	})
	@Auth([Role.OWNERADMIN, Role.OWNERMANAGER])
	@Post('/add-category')
	@ThrowError('clients-categories', 'create')
	async createCat(
		@Body() createClientCategoriesDto: CreateClientsCategoriesDto,
	): Promise<ClientsCategories | Error> {
		return await this.clientsCategoriesService.create(createClientCategoriesDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-category',
		summary: 'Удалить категорию',
		description: 'Удаляет категорию. Доступно только для OWNERADMIN и OWNERMANAGER',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет 0 - если ничего не было удалено и 1 - если категория была удалена',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет полномочий доступа',
	})
	@ApiResponse({
		status: 401,
		description: 'Пользователь не авторизован',
	})
	@ApiBody({
		type: DeleteClientsCategoriesDto,
		required: true,
	})
	@Auth([Role.OWNERADMIN, Role.OWNERMANAGER])
	@Delete('/delete-category')
	@ThrowError('clients-categories', 'delete')
	deleteCat(@Body() deleteClientsCategoriesDto: DeleteClientsCategoriesDto): Promise<number> {
		return this.clientsCategoriesService.delete(deleteClientsCategoriesDto)
	}

	@ApiOperation({
		operationId: 'get-one-category',
		summary: 'Получить одну категорию по id',
		description: 'Отдает категорию по id. Доступно без авторизации',
	})
	@ApiResponse({
		type: CreateClientsCategoriesDto,
		status: 200,
		description: 'Вернет объект найденной категории',
	})
	@ApiParam({
		name: 'id',
	})
	@Get('/get-category/:id')
	@ThrowError('clients-categories', 'getOneCategory')
	getCat(
		@Param() getOneClientsCategoriesDto: GetOneClientsCategoriesDto,
	): Promise<ClientsCategories> {
		return this.clientsCategoriesService.getOneCategory(getOneClientsCategoriesDto)
	}

	@ApiOperation({
		operationId: 'get-all-categories',
		summary: 'Получить все категории',
		description: 'Отдает список категорий в системе',
	})
	@ApiResponse({
		type: [CreateClientsCategoriesDto],
		status: 200,
		description: 'Вернет массив категорий',
	})
	@Get('/get-categories')
	@ThrowError('clients-categories', 'getAllCategories')
	getAllCats(): Promise<ClientsCategories[]> {
		return this.clientsCategoriesService.getAllCategories()
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-category',
		summary: 'Обновить категорию',
		description:
			'Создает новую категорию компании. Создать категорию может только OWNERADMIN и OWNERMANAGER',
	})
	@ApiResponse({
		type: UpdateClientsCategoriesDto,
		status: 200,
		description: 'Вернет обновленный объект категории',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет полномочий доступа',
	})
	@ApiResponse({
		status: 401,
		description: 'Пользователь не авторизован',
	})
	@ApiBody({
		type: UpdateClientsCategoriesDto,
		required: true,
	})
	@Auth([Role.OWNERADMIN, Role.OWNERMANAGER])
	@Put('/update-category')
	@ThrowError('clients-categories', 'update')
	async updateCat(
		@Body() updateClientCategoriesDto: UpdateClientsCategoriesDto,
	): Promise<ClientsCategories | Error> {
		return await this.clientsCategoriesService.update(updateClientCategoriesDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-type',
		summary: 'Добавить тип (подкатегорию)',
		description: 'Создает новый тип для категории. Доступно только для OWNERADMIN и OWNERMANAGER',
	})
	@ApiResponse({
		type: CreateClientsCategoriesTypesDto,
		status: 200,
		description: 'Вернет созданный тип',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет полномочий доступа',
	})
	@ApiResponse({
		status: 401,
		description: 'Пользователь не авторизован',
	})
	@ApiBody({
		type: CreateClientsCategoriesTypesDto,
		required: true,
	})
	@Auth([Role.OWNERADMIN, Role.OWNERMANAGER])
	@Post('/add-type')
	@ThrowError('clients-categories', 'createType')
	async createType(
		@Body() createClientsCategoriesTypesDto: CreateClientsCategoriesTypesDto,
	): Promise<ClientsCategoriesTypes | Error> {
		return await this.clientsCategoriesService.createType(createClientsCategoriesTypesDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-category',
		summary: 'Удалить тип (подкатегорию)',
		description: 'Удаляет тип категории. Доступно только для OWNERADMIN и OWNERMANAGER',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет 0 - если ничего не было удалено и 1 - если тип был удален',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет полномочий доступа',
	})
	@ApiResponse({
		status: 401,
		description: 'Пользователь не авторизован',
	})
	@ApiBody({
		type: DeleteOneClientsCategoriesTypesDto,
		required: true,
	})
	@Auth([Role.OWNERADMIN, Role.OWNERMANAGER])
	@Delete('/delete-type')
	@ThrowError('clients-categories', 'deleteType')
	deleteType(
		@Body()
		deleteOneClientsCategoriesTypesDto: DeleteOneClientsCategoriesTypesDto,
	): Promise<number> {
		return this.clientsCategoriesService.deleteType(deleteOneClientsCategoriesTypesDto)
	}

	@ApiOperation({
		operationId: 'get-one-type',
		summary: 'Получить одн тип по id',
		description: 'Отдает тип по id. Доступно без авторизации',
	})
	@ApiResponse({
		type: CreateClientsCategoriesTypesDto,
		status: 200,
		description: 'Вернет объект найденного типа',
	})
	@ApiParam({
		name: 'id',
	})
	@Get('/get-type/:id')
	@ThrowError('clients-categories', 'getOneCategoryType')
	getType(
		@Param() getOneClientsCategoriesTypeDto: GetOneClientsCategoriesTypeDto,
	): Promise<ClientsCategoriesTypes> {
		return this.clientsCategoriesService.getOneCategoryType(getOneClientsCategoriesTypeDto)
	}

	@ApiOperation({
		operationId: 'get-all-types',
		summary: 'Получить все типы',
		description: 'Отдает список типов категории в системе',
	})
	@ApiResponse({
		type: [CreateClientsCategoriesTypesDto],
		status: 200,
		description: 'Вернет массив категорий',
	})
	@ApiParam({
		name: 'catId',
	})
	@Get('/:catId/get-types/')
	@ThrowError('clients-categories', 'getAllCategoryType')
	getAllTypes(
		@Param() getAllClientsCategoriesOneTypeDto: GetAllClientsCategoriesTypeDto,
	): Promise<ClientsCategoriesTypes[]> {
		return this.clientsCategoriesService.getAllCategoryType(getAllClientsCategoriesOneTypeDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'upadte-type',
		summary: 'Обновить тип (подкатегорию)',
		description: 'Обновляет тип. Доступно только для OWNERADMIN и OWNERMANAGER',
	})
	@ApiResponse({
		type: CreateClientsCategoriesTypesDto,
		status: 200,
		description: 'Вернет обновленный объект типа',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет полномочий доступа',
	})
	@ApiResponse({
		status: 401,
		description: 'Пользователь не авторизован',
	})
	@ApiBody({
		type: UpdateClientsCategoriesTypesDto,
		required: true,
	})
	@Auth([Role.OWNERADMIN, Role.OWNERMANAGER])
	@Put('/update-type')
	@ThrowError('clients-categories', 'updateType')
	async updateType(
		@Body() updateClientCategoriesTypesDto: UpdateClientsCategoriesTypesDto,
	): Promise<ClientsCategoriesTypes | Error> {
		return await this.clientsCategoriesService.updateType(updateClientCategoriesTypesDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'enable-category',
		summary: 'Активировать/деактивировать категорию',
		description:
			'Обновляет параметр isEnable у категории. Доступно только для OWNERADMIN и OWNERMANAGER',
	})
	@ApiResponse({
		type: CreateClientsCategoriesDto,
		status: 200,
		description: 'Вернет обновленный объект категории',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет полномочий доступа',
	})
	@ApiResponse({
		status: 401,
		description: 'Пользователь не авторизован',
	})
	@ApiBody({
		type: EnableClientsCategoriesDto,
		required: true,
	})
	@Auth([Role.OWNERADMIN, Role.OWNERMANAGER])
	@Post('/enable-category')
	@ThrowError('clients-categories', 'enableCategory')
	async enableCategory(
		@Body() enableClientsCategoriesDto: EnableClientsCategoriesDto,
	): Promise<ClientsCategories> {
		return await this.clientsCategoriesService.enableCategory(enableClientsCategoriesDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'enable-type',
		summary: 'Активировать/деактивировать категорию',
		description:
			'Обновляет параметр isEnable у типа. Доступно только для OWNERADMIN и OWNERMANAGER',
	})
	@ApiResponse({
		type: CreateClientsCategoriesTypesDto,
		status: 200,
		description: 'Вернет обновленный объект типа',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет полномочий доступа',
	})
	@ApiResponse({
		status: 401,
		description: 'Пользователь не авторизован',
	})
	@ApiBody({
		type: EnableClientsCategoriesTypesDto,
		required: true,
	})
	@Auth([Role.OWNERADMIN, Role.OWNERMANAGER])
	@Post('/enable-type')
	@ThrowError('clients-categories', 'enableType')
	async enableType(
		@Body() enableClientsCategoriesTypesDto: EnableClientsCategoriesTypesDto,
	): Promise<ClientsCategoriesTypes> {
		return await this.clientsCategoriesService.enableType(enableClientsCategoriesTypesDto)
	}

	@ApiExcludeEndpoint()
	@Get('/filter-categories')
	@ThrowError('clients-categories', 'filterCategpries')
	async filterCategpries(@Query() f: FilterClientsCategoriesDto): Promise<any> {
		return await this.clientsCategoriesService.filterCategpries(f)
	}

	@ApiExcludeEndpoint()
	@Get('/filter-types')
	@ThrowError('clients-categories', 'filterTypes')
	async filterTypes(@Query() f: FilterClientsTypesDto): Promise<any> {
		return await this.clientsCategoriesService.filterTypes(f)
	}
}
