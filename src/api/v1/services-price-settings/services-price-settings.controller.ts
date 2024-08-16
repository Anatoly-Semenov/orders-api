import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { ServicesPriceSettingsService } from './services-price-settings.service'
import { CreateServicesPriceSettingDto } from './dto/create-services-price-setting.dto'
import { UpdateServicesPriceSettingDto } from './dto/update-services-price-setting.dto'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { Role } from '../users/enums/user-roles.enum'

@ApiTags('Настройки платежей в услуге')
@Controller('services-price-settings')
export class ServicesPriceSettingsController {
	constructor(private readonly servicesPriceSettingsService: ServicesPriceSettingsService) {}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-services-price-settings',
		summary: 'Добавление нового параметра цены услуги',
		description: 'Добавление нового параметра цены услуги',
	})
	@ApiResponse({
		type: CreateServicesPriceSettingDto,
		status: 201,
		description: 'Вернет созданный объект настроек цены услуги',
	})
	@ApiBody({
		type: CreateServicesPriceSettingDto,
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
	create(@Body() createServicesPriceSettingDto: CreateServicesPriceSettingDto) {
		return this.servicesPriceSettingsService.create(createServicesPriceSettingDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-all-service-price-settings',
		summary: 'Получение всех настроек цены услуги по id услуги',
		description: 'Вернет объект услуги',
	})
	@ApiParam({
		name: 'serviceId',
		description: 'id услуги',
		required: true,
	})
	@ApiResponse({
		type: [UpdateServicesPriceSettingDto],
		status: 200,
		description: 'Вернет массив объектов настроек цен услуги',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Get('/:serviceId/get-all')
	findAll(@Param('serviceId') serviceId: number) {
		return this.servicesPriceSettingsService.findAll(serviceId)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-one-service-price-settings',
		summary: 'Получение одной настройки цены по id услуги',
		description: 'Вернет объект услуги',
	})
	@ApiParam({
		name: 'serviceId',
		description: 'id услуги',
		required: true,
	})
	@ApiParam({
		name: 'id',
		description: 'id настроек цены услуги',
		required: true,
	})
	@ApiResponse({
		type: UpdateServicesPriceSettingDto,
		status: 200,
		description: 'Вернет объект настроек цены услуги',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Get('/:serviceId/get-one/:id')
	findOne(@Param('serviceId') serviceId: number, @Param('id') id: number) {
		return this.servicesPriceSettingsService.findOne(serviceId, id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-service-price-settings',
		summary: 'Обновление настроек цены услуги',
		description: 'Вернет объект настроек цены услуги',
	})
	@ApiParam({
		name: 'id',
		description: 'id параметра настроек услуги',
		required: true,
	})
	@ApiBody({
		type: UpdateServicesPriceSettingDto,
		required: true,
	})
	@ApiResponse({
		type: UpdateServicesPriceSettingDto,
		status: 200,
		description: 'Вернет объект настроек цены',
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если сущность не найдена',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Put('/update/:id')
	update(
		@Param('id') id: string,
		@Body() updateServicesPriceSettingDto: UpdateServicesPriceSettingDto,
	) {
		return this.servicesPriceSettingsService.update(+id, updateServicesPriceSettingDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-services-price-settings',
		summary: 'Удаление настроек услуги по id (полное из базы)',
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
	remove(@Param('id') id: number) {
		return this.servicesPriceSettingsService.delete(id)
	}
}
