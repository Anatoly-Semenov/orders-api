import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common'
import { Users } from '../users/entities/users.entity'
import { Clients } from './entities/clients.entity'
import { ClientsService } from './clients.service'
import { CreateClientDto } from './dto/create-clients.dto'
import { GetClientUsersDto } from './dto/get-client-users.dto'
import { GetOneClientsDto } from './dto/get-one.dto'
import { RemoveClientsDto } from './dto/remove-clients.dto'
import { UpdateClientsDto } from './dto/update-clients.dto'
import { Role } from '../users/enums/user-roles.enum'
import { Auth } from '../auth/decorators/auth.decorator'
import {
	ApiBearerAuth,
	ApiBody,
	ApiExcludeEndpoint,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'

import { EnableClientsDto } from './dto/enable-client.dto'
import { FilterClientsDto } from './dto/filter-clients.dto'
import { ThrowError } from 'src/decorators/ThrowError.decorator'
import { User } from '../users/decorators/users.decorator'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AddressesService } from '../addresses/addresses.service'
import { CreateAddressDto } from '../addresses/dto/create-address.dto'
import { EnableAddresseslDto } from '../addresses/dto/enable-address.dto'
import { GetOneAddresseslDto } from '../addresses/dto/get-one-address.dto'
import { UpdateAddressesDto } from '../addresses/dto/update-address.dto'
import { GetClientIdByAliasDto } from './dto/get-id-by-alias.dto'
import { GetIdByAliasResponseDto } from './dto/response/get-id-by-alias-response.dto'
import { CreateMerchantShopDto } from './dto/create-merchant-shop.dto'
import { CreateMerchantShopInTinkoffDto } from '../payments/dto/tinkoff/create-merchant-shop-in-tinkoff.dto'

import { CreateClientsIntegrationDto } from './dto/create-client-integration.dto'
import { UpdateClientIntegrationDto } from './dto/update-client-integration.dto'

import { ClientMerchantData } from './entities/client-merchant-data.entity'
import { GetClientCustomersDto } from './dto/get-client-customers.dto'
import { OrderCustomer } from '../orders/entities/order-customer.entity'
import { GetAllSmallListResponseDto } from './dto/response/get-all-small-list.response.dto'
import { GetClientTimeStepResponseDto } from './dto/response/get-client-time-step.response.dto'

@ApiTags('Компании')
@Controller('clients')
export class ClientsController {
	constructor(
		private readonly clientsService: ClientsService,
		private readonly addressesService: AddressesService,
	) {}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-client',
		summary: 'Созданиие компании',
		description: 'Вернет объект созданной компании',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект компании',
		type: CreateClientDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Вернет 400 если url компании уже существует',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiBody({
		type: CreateClientDto,
		required: true,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/add')
	@ThrowError('clients', 'create')
	async create(
		@Body() createClientDto: CreateClientDto,
		@User() user: any,
	): Promise<Clients | Error> {
		return await this.clientsService.create(createClientDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-all-clients',
		summary: 'Получение всех компаний пользователя',
		description:
			'Вернет массив объектов компаниий связанных с авторизованным пользователем, если он является владельцем',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет массив объектов компании',
		type: [CreateClientDto],
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 403 если у пользователя нет прав доступа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTADMIN,
	])
	@Get('/get/all')
	@ThrowError('clients', 'getAll')
	getAll(@User() user: any): Promise<Clients[]> {
		return this.clientsService.getAll(user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-all-clients-small',
		summary: 'Получение всех компаний пользователя (мини список)',
		description:
			'Вернет массив объектов компаниий связанных с авторизованным пользователем, если он является владельцем',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет массив объектов компании',
		type: [CreateClientDto],
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 403 если у пользователя нет прав доступа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTADMIN,
	])
	@Get('/get/all-small')
	@ThrowError('clients', 'getAllSmall')
	findAllSmallListClient(@User() user: any): Promise<GetAllSmallListResponseDto[]> {
		return this.clientsService.findAllSmallList(user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'check-services',
		summary: 'Проверка наличие услуг в компании',
		description: 'вернет true - если есть и false - если нет',
	})
	@ApiResponse({
		status: 200,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 403 если у пользователя нет прав доступа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTADMIN,
	])
	@ApiParam({
		name: 'appId',
	})
	@Get('/get/:appId/check-services')
	@ThrowError('clients', 'getAllSmall')
	checkServices(@Param('appId') appId: string, @User() user) {
		return this.clientsService.checkServices(appId, user.id)
	}

	@ApiExcludeEndpoint()
	@Get('/filter')
	@ThrowError('clients', 'filter')
	async filter(@Query() f: FilterClientsDto): Promise<any> {
		return await this.clientsService.filter(f)
	}

	@ApiOperation({
		operationId: 'get-one-clients',
		summary: 'Получение одной компании пользователя',
		description:
			'Вернет объект компании связанной с авторизованным пользователем, если он является владельцем',
	})
	@ApiParam({
		name: 'appId',
	})
	@ApiQuery({
		name: 'excludeServices',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект компании',
		type: CreateClientDto,
	})
	@Get('/get/:appId')
	@ThrowError('clients', 'getOne')
	getOne(
		@Param() getOneClientsDto: GetOneClientsDto,
		@Query('excludeServices') excludeServices: string,
		@User() user,
	): Promise<Clients> {
		return this.clientsService.getOne(getOneClientsDto, +excludeServices, user.id)
	}

	@ApiOperation({
		operationId: 'get-client-id-by-alias',
		summary: 'Получение id компании по алиасу',
		description: 'Вернет объект с id компании',
	})
	@ApiParam({
		name: 'idAlias',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект с id компании',
		type: GetIdByAliasResponseDto,
	})
	@Get('/get-id/:idAlias')
	@ThrowError('clients', 'getIdByAlias')
	getIdByAlias(@Param() getIdByAliasDto: GetClientIdByAliasDto): Promise<GetIdByAliasResponseDto> {
		return this.clientsService.getIdByAlias(getIdByAliasDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-time-step',
		summary: 'Получение настройки шага времени',
		description: 'Веренет настройки шага времени',
	})
	@ApiParam({
		name: 'appId',
	})
	@ApiResponse({
		status: 200,
		description: 'Веренет настройки шага времени',
		type: GetClientTimeStepResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если у пользователя нет прав доступа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTADMIN,
	])
	@Get('/get-time-step/:appId')
	@ThrowError('clients', 'getOne')
	getClientTimeStep(
		@Param() getOneClientsDto: GetOneClientsDto,
		@User() user: any,
	): Promise<GetClientTimeStepResponseDto> {
		return this.clientsService.getClientTimeStep(getOneClientsDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'access-client',
		summary: 'Проверка доступности компании для пользователя',
		description: 'Вернет true если доступ есть',
	})
	@ApiResponse({
		status: 200,
		type: Boolean,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 403 если у пользователя нет прав доступа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTADMIN,
	])
	@Get('/access/:appId')
	@ThrowError('clients', 'getOne')
	accessClient(@Param() getOneClientsDto: GetOneClientsDto, @User() user: any) {
		return this.clientsService.accessClient(getOneClientsDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'clone-client',
		summary: 'Клонирование компании',
		description: 'Создаст дубликат компании',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет новый объект компании',
		type: CreateClientDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 403 если у пользователя нет прав доступа',
	})
	@ApiBody({
		type: GetOneClientsDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTADMIN,
	])
	@Post('/clone')
	@ThrowError('clients', 'clone')
	clone(@Body() getOneClientsDto: GetOneClientsDto, @User() user): Promise<Clients | Error> {
		return this.clientsService.clone(getOneClientsDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-client',
		summary: 'Удаление компании',
		description: 'Удаляет компанию и связанные с ней данные',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет 1 - если операция прошла успешно, 0 - если ничего не было удалено',
		type: CreateClientDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 403 если у пользователя нет прав доступа',
	})
	@ApiBody({
		type: GetOneClientsDto,
	})
	@Auth([Role.CLIENTADMIN])
	@Delete('/delete')
	@ThrowError('clients', 'delete')
	delete(@Body() removeClientsDto: RemoveClientsDto, @User() user): Promise<number> {
		return this.clientsService.delete(removeClientsDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-client',
		summary: 'Обновляет данные компании',
		description: 'Вернет объект обновленной компании',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет обновленный объект компании',
		type: UpdateClientsDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Вернет 400 если url компании уже существует',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiBody({
		type: UpdateClientsDto,
		required: true,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Put('/update')
	@ThrowError('clients', 'update')
	async update(@Body() updateClientsDto: UpdateClientsDto, @User() user): Promise<Clients | Error> {
		return await this.clientsService.update(
			{
				...updateClientsDto,
			},
			user.id,
		)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-client-users',
		summary: 'Получить всех пользователей связанных с компанией',
		description: 'Вернет массив пользователей',
	})
	@ApiResponse({
		status: 200,
		description: 'ВВернет массив пользователей',
		type: CreateUserDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 403 если нет прав доступа',
	})
	@ApiParam({
		name: 'appId',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Get('/:appId/users/')
	@ThrowError('clients', 'getUsers')
	getUsers(@Param() getClientUsersDto: GetClientUsersDto, @User() user): Promise<Users[]> {
		return this.clientsService.getUsers(getClientUsersDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-client-customers',
		summary: 'Получить всех покупателей связанных с компанией',
		description: 'Вернет массив покупателей',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет массив покупателей',
		type: [OrderCustomer],
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 403 если нет прав доступа',
	})
	@ApiParam({
		name: 'appId',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Get('/:appId/customers/')
	@ThrowError('clients', 'getCustomers')
	async getCustomers(
		@Param() getClientCustomersDto: GetClientCustomersDto,
		@User() user,
	): Promise<OrderCustomer[]> {
		if (user) {
			const access = await this.clientsService.accessClient(
				{
					appId: +getClientCustomersDto.appId,
				},
				user.id,
			)

			if (!access) {
				throw new ForbiddenException('Access to the company is forbidden')
			}
		}
		return this.clientsService.getCustomers(getClientCustomersDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'enable-client',
		summary: 'Активация/деактивация компании',
		description: 'Вернет массив пользователей',
	})
	@ApiResponse({
		status: 200,
		description: 'Вренет входные данные',
		type: EnableClientsDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если нет прав доступа',
	})
	@ApiBody({
		type: EnableClientsDto,
		required: true,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/enable')
	@ThrowError('clients', 'enable')
	async enable(@Body() enableClientsDto: EnableClientsDto): Promise<Clients> {
		return await this.clientsService.enable(enableClientsDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-address',
		summary: 'Добавление адреса',
		description: 'Вернет объект адреса',
	})
	@ApiResponse({
		status: 200,
		description: 'Вренет созданный объект адреса',
		type: CreateAddressDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если нет прав доступа',
	})
	@ApiBody({
		type: CreateAddressDto,
		required: true,
	})
	@ApiParam({
		name: 'appId',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/:appId/addresses/add')
	@ThrowError('addresses', 'create')
	async createAddress(
		@Body() createAddressDto: CreateAddressDto,
		@Param('appId') appId,
		@User() user,
	) {
		createAddressDto.files = []
		if (user) {
			const access = await this.clientsService.accessClient(
				{
					appId,
				},
				user.id,
			)

			if (!access) {
				throw new ForbiddenException('Access to the company is forbidden')
			}
		}
		return this.addressesService.create({
			...createAddressDto,
			appId: Number(appId),
		})
	}

	@ApiOperation({
		operationId: 'get-all-address',
		summary: 'Получить все адреса компании',
		description: 'Вернет массив адресов',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет массив адресов',
		type: [CreateAddressDto],
	})
	@ApiParam({
		name: 'appId',
	})
	@Get('/:appId/addresses/get/all')
	@ThrowError('addresses', 'findAll')
	async findAll(@Param('appId') appId: string, @User() user) {
		if (user) {
			const access = await this.clientsService.accessClient(
				{
					appId: +appId,
				},
				user.id,
			)

			if (!access) {
				throw new ForbiddenException('Access to the company is forbidden')
			}
		}
		return this.addressesService.findAll(Number(appId))
	}

	@ApiOperation({
		operationId: 'get-all-address-small',
		summary: 'Получить все адреса компании (мини список)',
		description: 'Вернет массив адресов',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет массив адресов',
		type: [CreateAddressDto],
	})
	@ApiParam({
		name: 'appId',
	})
	@Get('/:appId/addresses/get/all-small')
	@ThrowError('addresses', 'findAllSmall')
	async findAllSmallList(@Param('appId') appId: string, @User() user) {
		if (user) {
			const access = await this.clientsService.accessClient(
				{
					appId: +appId,
				},
				user.id,
			)

			if (!access) {
				throw new ForbiddenException('Access to the company is forbidden')
			}
		}
		return this.addressesService.findAllSmallList(Number(appId))
	}

	@ApiOperation({
		operationId: 'get-one-address',
		summary: 'Получить адрес компании',
		description: 'Вернет объект адреса',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект адреса',
		type: CreateAddressDto,
	})
	@ApiParam({
		name: 'appId',
		description: 'id компании',
	})
	@ApiParam({
		name: 'id',
		description: 'id адреса',
	})
	@Get('/:appId/addresses/:id')
	@ThrowError('addresses', 'findOne')
	async findOne(@Param('id') id: string, @Param('appId') appId: string, @User() user) {
		if (user) {
			const access = await this.clientsService.accessClient(
				{
					appId: +appId,
				},
				user.id,
			)

			if (!access) {
				throw new ForbiddenException('Access to the company is forbidden')
			}
		}
		return this.addressesService.findOne(Number(id), Number(appId))
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'clone-address',
		summary: 'Клонирование адреса',
		description: 'Вернет новый объект адреса',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет новый объект адреса',
		type: CreateAddressDto,
	})
	@ApiParam({
		name: 'appId',
		description: 'id компании',
	})
	@ApiParam({
		name: 'id',
		description: 'id адреса',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/:appId/addresses/:id/clone')
	@ThrowError('addresses', 'clone')
	cloneAddress(@Param('id') id: string, @Param('appId') appId: string, @User() user) {
		return this.addressesService.clone(Number(id), Number(appId), user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-address',
		summary: 'Обновление данных адреса',
		description: 'Вернет обновленный объект адреса',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет обновленный объект адреса',
		type: CreateAddressDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если адрес будет не найден',
	})
	@ApiParam({
		name: 'appId',
		description: 'id компании',
	})
	@ApiParam({
		name: 'id',
		description: 'id адреса',
	})
	@ApiBody({
		type: UpdateAddressesDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Put('/:appId/addresses/:id/update')
	@ThrowError('addresses', 'update')
	updateAddress(
		@Param('appId') appId: string,
		@Param('id') id: string,
		@Body() updateAddressesDto: UpdateAddressesDto,
		@User() user,
	) {
		return this.addressesService.update(Number(id), Number(appId), updateAddressesDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-address',
		summary: 'Удалить адрес',
		description: 'Удалит адрес и связанные данные',
	})
	@ApiResponse({
		status: 200,
		description: 'Удалит адрес и связанные данные. 1 - данные удалены, 0 - не удалены',
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если адрес будет не найден',
	})
	@ApiParam({
		name: 'appId',
		description: 'id компании',
	})
	@ApiBody({
		type: GetOneAddresseslDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Delete('/:appId/addresses/delete')
	@ThrowError('addresses', 'delete')
	remove(
		@Param('appId') appId: string,
		@Body() getOneAddresseslDto: GetOneAddresseslDto,
		@User() user,
	) {
		return this.addressesService.delete(Number(appId), getOneAddresseslDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'enable-address',
		summary: 'Активация/деактивация адреса',
		description: 'Активирует/деактивирует адрес',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект запроса',
		type: EnableAddresseslDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если адрес будет не найден',
	})
	@ApiParam({
		name: 'appId',
		description: 'id компании',
	})
	@ApiBody({
		type: EnableAddresseslDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/:appId/addresses/enable')
	@ThrowError('addresses', 'enable')
	async enableAddress(
		@Param('appId') appId: string,
		@Body() enableAddresseslDto: EnableAddresseslDto,
		@User() user,
	) {
		return await this.addressesService.enable(Number(appId), enableAddresseslDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'create-merchant-shop',
		summary: 'Добавление мерчанта в тинькофф',
		description: 'Добавление мерчанта в тинькофф',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект запроса',
		type: CreateMerchantShopDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если адрес будет не найден',
	})
	@ApiBody({
		type: CreateMerchantShopDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/create-merchant-shop')
	async createMerchantShop(@Body() dto: CreateMerchantShopDto & CreateMerchantShopInTinkoffDto) {
		return await this.clientsService.createMerchantShop(dto)
	}
	@ApiOperation({
		operationId: 'get-merchant-shop',
		summary: 'Получение мерчанта в тинькофф',
		description: 'Получение мерчанта в тинькофф',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет мерчанта',
		type: ClientMerchantData,
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если клиент или мерчант будет не найден',
	})
	@ApiParam({
		name: 'clientId',
		description: 'id клиента',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'create-client-integration',
		summary: 'Добавление данных для интеграций',
		description: 'Добавление данных для интеграций',
	})
	@ApiResponse({
		status: 201,
		description: 'Вернет объект запроса',
		type: CreateClientsIntegrationDto,
	})
	@ApiBody({
		type: CreateClientsIntegrationDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/create-integration')
	async createClientIntegration(@Body() dto: CreateClientsIntegrationDto) {
		return await this.clientsService.createClientIntegrations(dto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-client-integration',
		summary: 'Обновление данных для интеграций',
		description: 'Обновление данных для интеграций',
	})
	@ApiResponse({
		status: 201,
		description: 'Вернет объект запроса',
		type: UpdateClientIntegrationDto,
	})
	@ApiBody({
		type: UpdateClientIntegrationDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Put('/update-integration')
	async updateClientIntegration(@Body() dto: UpdateClientIntegrationDto) {
		return await this.clientsService.updateClientIntegrations(dto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-all-client-integration',
		summary: 'Получение всех интеграций компании',
		description: 'Получение всех интеграций компании',
	})
	@Get('/get-all-integrations/:clientId')
	async getAllClientIntegration(@Param('clientId') clientId: string) {
		return await this.clientsService.getAllClientIntegration(+clientId)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-one-client-integration',
		summary: 'Получение одной интеграции компании по id',
		description: 'Получение одной интеграции компании id',
	})
	@ApiParam({
		name: 'clientId',
	})
	@ApiParam({
		name: 'integrationId',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Get('/get-one-integration/:clientId/:integrationId')
	async getOneClientIntegration(
		@Param('clientId') clientId: string,
		@Param('integrationId') integrationId: string,
	) {
		return await this.clientsService.getOneClientIntegration(+clientId, +integrationId)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-client-integration',
		summary: 'Удаление интеграции по id',
		description: 'Удаление интеграции по id',
	})
	@ApiParam({
		name: 'integrationId',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Get('/delete-integration/:clientId/:integrationId')
	async deleteClientIntegration(@Param('integrationId') integrationId: string) {
		return await this.clientsService.deleteClientIntegration(+integrationId)
	}
	@Get('/merchant-shop/:clientId')
	getMerchantShop(@Param('clientId') clientId: string) {
		return this.clientsService.getMerchantShop(clientId)
	}
}
