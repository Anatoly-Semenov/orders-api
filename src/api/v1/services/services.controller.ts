import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common'
import { ServicesService } from './services.service'
import { CreateServicesDto } from './dto/create-services.dto'
import { UpdateServicesDto } from './dto/update-services.dto'
import { CustomerCanViewDto } from './dto/customer-can-view.dto'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Role } from '../users/enums/user-roles.enum'
import { Auth } from '../auth/decorators/auth.decorator'
import { Services } from './entities/services.entity'
import { ServiceResponseDto } from './dto/response/service.response.dto'
import { ChangePositionServiceDto } from './dto/change-position-service.dto'
import { ServicesDeleteManyDto } from './dto/delete-many-service.dto'
import { FindAllServicesDto } from './dto/find-all-services.dto'
import { ServicesSmallListDto } from './dto/response/services-small-list.response.dto'
import { AddTargetDto } from './dto/add-target.dto'
import { UpdateTargetDto } from './dto/update-target.dto'
import { TargetResponseDto } from './dto/response/target.response.dto'
import { ThrowError } from 'src/decorators/ThrowError.decorator'
import { User } from '../users/decorators/users.decorator'
import { CloneServiceDto } from './dto/clone-service.dto'
import { GetServicePriceDto } from './dto/get-service-price.dto'
import { ServicesSmallListSubClientDto } from './dto/response/services-small-list-subclient.response.dto'

@ApiTags('Услуги')
@Controller('services')
export class ServicesController {
	constructor(private readonly servicesService: ServicesService) {}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-services',
		summary: 'Добавление новой услуги',
		description: 'Создаст новую услугу',
	})
	@ApiResponse({
		type: CreateServicesDto,
		status: 201,
		description: 'Вернет созданный объект услуги',
	})
	@ApiBody({
		type: CreateServicesDto,
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
	create(@Body() createServicesDto: CreateServicesDto): Promise<Services> {
		return this.servicesService.create(createServicesDto)
	}

	@ApiOperation({
		operationId: 'find-all-services',
		summary: 'Получение всех услуг по id компании',
		description: 'Вернет массив услуг',
	})
	@ApiParam({
		name: 'clientId',
		required: true,
	})
	@ApiResponse({
		type: [ServiceResponseDto],
		status: 200,
		description: 'Вернет массив услуг',
	})
	@Get('/:clientId')
	findAll(
		@Param('clientId') clientId: number,
		@Query() findAllServicesDto: FindAllServicesDto,
	): Promise<Services[]> {
		return this.servicesService.findAll(clientId, findAllServicesDto)
	}

	@ApiOperation({
		operationId: 'find-all-small-data-for-subclient-services',
		summary: 'Получение мини списка услуг по id компании для субклиента',
		description: 'Вернет массив услуг',
	})
	@ApiParam({
		name: 'clientId',
		required: true,
	})
	@ApiResponse({
		type: [ServicesSmallListSubClientDto],
		status: 200,
		description: 'Вернет массив услуг',
	})
	@Get('/:clientId/small-subclient')
	findAllSmallDataForSubclient(
		@Param('clientId') clientId: number,
		@Query() findAllServicesDto: FindAllServicesDto,
	) {
		return this.servicesService.findAllSmallDataForSubclient(clientId, findAllServicesDto)
	}

	@ApiOperation({
		operationId: 'find-all-small-list-services',
		summary: 'Получение всех услуг по id компании (Мини список)',
		description: 'Вернет массив услуг',
	})
	@ApiParam({
		name: 'clientId',
		required: true,
	})
	@ApiResponse({
		type: [ServicesSmallListDto],
		status: 200,
		description: 'Вернет массив услуг',
	})
	@Get('/:clientId/small')
	findAllSmallList(
		@Param('clientId') clientId: number,
		@Query() findAllServicesDto: FindAllServicesDto,
	) {
		return this.servicesService.findAllSmallList(clientId, findAllServicesDto)
	}

	@ApiOperation({
		operationId: 'find-one-service',
		summary: 'Получение одной услуги по id компании',
		description: 'Вернет объект услуги',
	})
	@ApiParam({
		name: 'clientId',
		description: 'id компании',
		required: true,
	})
	@ApiParam({
		name: 'id',
		description: 'id услуги',
		required: true,
	})
	@ApiResponse({
		type: ServiceResponseDto,
		status: 200,
		description: 'Вернет объект услуги',
	})
	@Get('/:clientId/:id')
	findOne(@Param('clientId') clientId: number, @Param('id') id: number) {
		return this.servicesService.findOne(clientId, id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-service',
		summary: 'Обновление одной услуги',
		description: 'Вернет объект услуги',
	})
	@ApiParam({
		name: 'id',
		description: 'id услуги',
		required: true,
	})
	@ApiResponse({
		type: Services,
		status: 200,
		description: 'Вернет объект услуги',
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если услуга не найдена',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Put(':id')
	update(@Param('id') id: number, @Body() updateServicesDto: UpdateServicesDto) {
		return this.servicesService.update(+id, updateServicesDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-services',
		summary: 'Удаление одной услуги по id',
		description: 'Вернет 1 - если удалено, 0 - если нет',
	})
	@ApiParam({
		name: 'id',
		description: 'id услуги',
		required: true,
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет 1 - если удалено, 0 - если нет',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Delete('/delete/:id')
	delete(@Param('id') id: string) {
		return this.servicesService.delete(+id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-many-services',
		summary: 'Удаление нескольких услуг по id',
		description: 'Вернет 1 - если удалено, 0 - если нет',
	})
	@ApiBody({
		type: ServicesDeleteManyDto,
		required: true,
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет 1 - если удалено, 0 - если нет',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Delete('/delete-many')
	deleteMany(@Body() servicesDeleteManyDto: ServicesDeleteManyDto) {
		return this.servicesService.deleteMany(servicesDeleteManyDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'customer-can-view-services',
		summary: 'Активация/деактивация видимости для пользователя одной услуги по id',
		description: 'Активирует/деактивирует параметр customerCanView',
	})
	@ApiBody({
		type: CustomerCanViewDto,
		required: true,
	})
	@ApiParam({
		name: 'id',
		description: 'id услуги',
		required: true,
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет 1 - если данные обновлены, 0 - если нет',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/customer-can-view/:id')
	customerCanView(@Param('id') id: number, @Body() customerCanViewDto: CustomerCanViewDto) {
		return this.servicesService.customerCanView(customerCanViewDto, +id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'change-position-services',
		summary: 'Изменение позиции услуги',
		description: 'Изменение позиции услуги в общем списке',
	})
	@ApiBody({
		type: [ChangePositionServiceDto],
	})
	@ApiResponse({
		type: [ServiceResponseDto],
		status: 200,
		description: 'Вернет объект услуги',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/change-position')
	changePosition(
		@Body()
		changePositionServiceDto: ChangePositionServiceDto[],
	) {
		return this.servicesService.changePosition(changePositionServiceDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-target',
		summary: 'Добавление цели',
		description: 'Добавит цель к услуге',
	})
	@ApiBody({
		type: AddTargetDto,
	})
	@ApiParam({
		name: 'serviceId',
		required: true,
	})
	@ApiResponse({
		type: TargetResponseDto,
		status: 200,
		description: 'Вернет объект созданной цели',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/:serviceId/targets/add/')
	addTarget(
		@Param('serviceId') serviceId: string,
		@Body()
		addTargetDto: AddTargetDto,
	) {
		return this.servicesService.addTarget(+serviceId, addTargetDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-many-target',
		summary: 'Добавление нескольких целей',
		description: 'Добавит несколько целей к услуге',
	})
	@ApiBody({
		type: [AddTargetDto],
	})
	@ApiParam({
		name: 'serviceId',
		required: true,
	})
	@ApiResponse({
		type: [TargetResponseDto],
		status: 200,
		description: 'Вернет массив созданных целей',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/:serviceId/targets/add-many/')
	addManyTarget(
		@Param('serviceId') serviceId: string,
		@Body()
		addManyTargetDto: AddTargetDto[],
	) {
		return this.servicesService.addManyTarget(+serviceId, addManyTargetDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-target',
		summary: 'Обновление цели',
		description: 'Обновление цели в услуге',
	})
	@ApiBody({
		type: UpdateTargetDto,
	})
	@ApiParam({
		name: 'serviceId',
		required: true,
	})
	@ApiResponse({
		type: TargetResponseDto,
		status: 200,
		description: 'Вернет объект обновленной цели',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Put('/update-target/:targetId')
	updateTarget(
		@Param('targetId') targetId: string,
		@Body()
		updateTargetDto: UpdateTargetDto,
	) {
		return this.servicesService.updateTarget(+targetId, updateTargetDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-target',
		summary: 'Удаление цели',
		description: 'Изменяет параметр isDeleted на true',
	})
	@ApiParam({
		name: 'targetId',
		required: true,
	})
	@ApiResponse({
		type: TargetResponseDto,
		status: 200,
		description: 'Вернет объект обновленной цели',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Put('/delete-target/:targetId')
	deleteTargets(
		@Param('targetId')
		targetId: string,
	) {
		return this.servicesService.deleteTargets(+targetId)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-many-target',
		summary: 'Удаление всех целей из услуги',
		description: 'Изменяет параметр isDeleted на true',
	})
	@ApiParam({
		name: 'serviceId',
		required: true,
	})
	@ApiResponse({
		type: TargetResponseDto,
		status: 200,
		description: 'Вернет массив обновленных целей',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Put('/delete-many-targets/:serviceId')
	deleteManyTargets(
		@Param('serviceId')
		serviceId: string,
	) {
		return this.servicesService.deleteManyTargets(+serviceId)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'clone-service',
		summary: 'Клонирование услуги',
		description: 'Создаст дубликат услуги',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет новый объект услуги',
		type: ServiceResponseDto,
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
		type: CloneServiceDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTADMIN,
	])
	@Post('/clone')
	@ThrowError('services', 'clone')
	clone(@Body() getOneClientsDto: CloneServiceDto, @User() user): Promise<Services | Error> {
		return this.servicesService.clone(getOneClientsDto)
	}

	@Get('/:serviceId/targets/get-all')
	getTargets(@Param('serviceId') serviceId: string) {
		return this.servicesService.getTargets(+serviceId)
	}

	@ApiOperation({
		operationId: 'get-service-prcie',
		summary: 'Получение цены одной услуги',
		description: 'Вернет стоимость',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет стоимость',
		type: ServiceResponseDto,
	})
	@ApiBody({
		type: GetServicePriceDto,
	})
	@ApiParam({
		name: 'serviceId',
	})
	@Post('/calculate-price/:serviceId')
	getServicePrice(
		@Param('serviceId') serviceId: string,
		@Body() getServicePriceDto: GetServicePriceDto,
	) {
		return this.servicesService.getServicePrice(+serviceId, getServicePriceDto)
	}
}
