import { Delete, Get, HttpCode, Put, Query, Res } from '@nestjs/common'
import { Body, Controller, Param, Post } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Orders } from './entities/orders.entity'
import { Role } from '../users/enums/user-roles.enum'
import { Auth } from '../auth/decorators/auth.decorator'
import { FilterOrdersDto } from './dto/filter-orders.dto'
import { User } from 'src/api/v1/users/decorators/users.decorator'
import { OrderPaymentDto } from './dto/order-payment.dto'
import { ThrowError } from 'src/decorators/ThrowError.decorator'
import { CreateOrderTechDto } from './dto/create-order-tech.dto'
import { OrderTech } from './entities/order-tech.entity'
import { UpdateOrderTechDto } from './dto/update-order-tech.dto'
import { FilterOrdersV2Dto } from './dto/filter-order-v2.dto'
import { FilteredOrderResponseDto } from './dto/response/filtered-order.response.dto'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { TinkoffNotificationDto } from '../payments/dto/payment/tinkoff-notification.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { ExportOrdersDTO } from './dto/export-orders.dto'
import { Readable } from 'stream'
import { OrderCustomer } from './entities/order-customer.entity'
import { FindOrderCustomerDto } from './dto/find-order-customer.dto'
import { DeleteResponseDto } from '../system/dto/delete-response.dto'

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-order',
		summary: 'Создать заказ',
		description: 'Добавление заказа в систему',
	})
	@ApiBody({
		type: CreateOrderDto,
	})
	@ApiResponse({
		status: 200,
		type: CreateOrderDto,
		description: 'Вернет созданный объект заказа',
	})
	@Post('/add')
	@ThrowError('orders', 'create')
	async create(@User() user, @Body() createOrderDto: CreateOrderDto): Promise<any> {
		return await this.ordersService.create(+user?.id, createOrderDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-order-many',
		summary: 'Создать множество заказов',
		description: 'Добавление заказов в систему',
	})
	@ApiBody({
		type: CreateOrderDto,
	})
	@ApiResponse({
		status: 200,
		type: CreateOrderDto,
		description: 'Вернет созданный массив заказов',
	})
	@Post('/add-many')
	@ThrowError('orders', 'create-many')
	async createMany(): Promise<any> {
		return await this.ordersService.createMany()
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'add-order-tech',
		summary: 'Создать технический заказ',
		description: 'Добавление технического заказа в систему',
	})
	@ApiBody({
		type: CreateOrderDto,
	})
	@ApiResponse({
		status: 200,
		type: CreateOrderTechDto,
		description: 'Вернет созданный объект технического заказа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
	])
	@Post('/add-tech')
	@ThrowError('orders', 'create-tech')
	async createTech(
		@User() user,
		@Body() createOrderTechDto: CreateOrderTechDto,
	): Promise<OrderTech | Error> {
		return await this.ordersService.createOrderTech(+user.id, createOrderTechDto)
	}

	@ApiOperation({
		operationId: 'get-one-order-by-id',
		summary: 'Получить заказ по id',
		description: 'Получить заказ по id',
	})
	@ApiParam({
		name: 'id',
	})
	@Get('/get/:id')
	@ThrowError('orders', 'getOne')
	getOne(@Param('id') id: number, @User() user): Promise<Partial<OrderTech> | Error> {
		return this.ordersService.getOne(+id, user)
	}

	// Auth guard
	@Get('/get')
	@ThrowError('orders', 'getAll')
	getAll(@User() user): Promise<Partial<OrderTech>[]> {
		return this.ordersService.getAll(user)
	}

	@ApiOperation({
		operationId: 'get-all-orders-by-client-id',
		summary: 'Получить все заказы по id компании',
		description: 'Получить все заказы по id компании',
	})
	@ApiParam({
		name: 'clientId',
	})
	@Get('/get-all-by-client/:clientId')
	@ThrowError('orders', 'getAllByClient')
	getAllByClient(@Param('clientId') clientId: string, @User() user): Promise<Partial<Orders>[]> {
		return this.ordersService.getAllByClient(clientId, user)
	}

	@ApiOperation({
		operationId: 'order-filter',
		summary: 'Фильтрация заказов',
		description: 'Получение данные о заказ с применением параметров фильтра',
	})
	@ApiQuery({
		type: FilterOrdersDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Объект отфильтрованных данных',
	})
	@Get('/filter')
	@ThrowError('orders', 'filter')
	async filter(@Query() f: FilterOrdersDto, @User() user): Promise<Partial<Orders>[]> {
		return await this.ordersService.filter(f, user)
	}

	@ApiOperation({
		operationId: 'order-filter-v2',
		summary: 'Фильтрация заказов v2',
		description: 'Получение данные о заказ с применением параметров фильтра',
	})
	@ApiQuery({
		type: FilterOrdersV2Dto,
	})
	@ApiResponse({
		status: 200,
		description: 'Объект отфильтрованных данных',
		type: FilteredOrderResponseDto,
	})
	@Get('/filter-v2')
	@ThrowError('orders', 'filterV2')
	async filterV2(
		@Query() dto: FilterOrdersV2Dto,
		@User() user,
	): Promise<[Partial<Orders>[], number]> {
		return await this.ordersService.filterV2(dto, user)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-order',
		summary: 'Удаление заказа',
		description: 'Полностью удалит заказ из системы',
	})
	@ApiResponse({
		status: 200,
		type: DeleteResponseDto,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
	])
	@Delete('/:id')
	@ThrowError('orders', 'delete')
	delete(@Param('id') id: string): Promise<DeleteResponseDto> {
		return this.ordersService.delete(+id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-order',
		summary: 'Обновление заказа',
		description: 'Обновляет данные в заказе без пересчета сумм и продолжительности',
	})
	@ApiBody({
		type: UpdateOrderDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет обновленный объект заказа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
	])
	@Put('/update/')
	@ThrowError('orders', 'update')
	async update(@Body() updateOrderDto: UpdateOrderDto): Promise<Orders | Error> {
		return await this.ordersService.update(null, updateOrderDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-order-status',
		summary: 'Обновление статуса заказа',
		description: 'Обновляет статус в заказе без пересчета сумм и продолжительности',
	})
	@ApiBody({
		type: UpdateOrderStatusDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет обновленный объект заказа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
	])
	@Put('/update-status/')
	@ThrowError('orders', 'update')
	async updateStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<Orders | Error> {
		return await this.ordersService.updateStatus(updateOrderStatusDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-order-tech',
		summary: 'Обновление технического заказа',
		description: 'Обновляет данные в техническом заказе',
	})
	@ApiBody({
		type: UpdateOrderTechDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет обновленный объект технического заказа',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
	])
	@Put('/update-tech/')
	@ThrowError('orders', 'update-tech')
	async updateOrderTech(@Body() updateOrderTechDto: UpdateOrderTechDto): Promise<Orders | Error> {
		return await this.ordersService.updateOrderTech(updateOrderTechDto)
	}

	@Get('/success')
	@ThrowError('orders', 'orderSuccess')
	async orderSuccess(
		@Query() orderPaymentDto: OrderPaymentDto,
		@User() user,
	): Promise<Partial<Orders>> {
		return await this.ordersService.orderSuccess(orderPaymentDto, user)
	}

	@Get('/failed')
	@ThrowError('orders', 'orderFiled')
	async orderFiled(@Query() orderPaymentDto: OrderPaymentDto) {
		return await this.ordersService.orderFiled(orderPaymentDto)
	}

	@ApiOperation({
		operationId: 'export-orders',
		summary: 'Экспортировать заказы в виде файлов',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект файла в зависимости от переданных параметров',
	})
	@ApiBody({
		type: ExportOrdersDTO,
		required: true,
	})
	@Post('/export')
	@ThrowError('orders', 'exportOrders')
	async exportOrders(@Body() exportOrdersDTO: ExportOrdersDTO, @User() user, @Res() res) {
		const data: Readable = await this.ordersService.exportOrders(exportOrdersDTO, user)

		res.set({
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': `attachment; filename="orders.xlsx"`,
		})
		data.pipe(res)

		return data
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'find-order-customers',
		summary: 'Получить пользователей по полям',
		description: 'Получить пользователей по полям',
	})
	@ApiBody({
		type: FindOrderCustomerDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет обновленный объект покупателя',
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.CLIENTACCOUNTANT,
		Role.CLIENTEMPLOYEE,
	])
	@Post('/find-customers/')
	@ThrowError('orders', 'find-customer')
	async findOrderCustomer(@Body() dto: FindOrderCustomerDto): Promise<OrderCustomer[] | Error> {
		return await this.ordersService.findOrderCustomer(dto)
	}

	@MessagePattern('tinkoffNotification')
	tinkoffNotification(@Payload() dto: TinkoffNotificationDto) {
		return this.ordersService.tinkoffNotification(dto)
	}

	@HttpCode(200)
	@Post('/tinkoff-notification')
	sendTinkoffNotification(@Body() dto: TinkoffNotificationDto): string {
		this.ordersService.tinkoffNotification(dto)
		return 'OK'
	}
}
