import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { Role } from '../users/enums/user-roles.enum'
import { GetAllClientPaymentsSettingsDto } from './dto/get-all-client-payments-settings.dto'
import { DeleteClientPaymentsSettingsDto } from './dto/client-patments-settings-delete.dto'
import { UpadteClientPaymentsSettingsDto } from './dto/client-patments-settings-update.dto'
import { GetClientPaymentsSettingsDto } from './dto/client-patments-settings-get.dto'
import { ClientPaymentsSettingsDto } from './dto/client-patments-settings.dto'
import { ClientPaymentsSettings } from './entities/clients-payments-settings.entity'
import { ClientPaymentsSettingsService } from './client-payments-settings.service'
import { EnableClientPaymentsSettingsDto } from './dto/enable-payments-settings.dto'
import { ThrowError } from 'src/decorators/ThrowError.decorator'

@ApiTags('Client app payments')
@Controller('payments')
export class ClientPaymentsSettingsController {
	constructor(private readonly clientPaymentsSettingsService: ClientPaymentsSettingsService) {}

	// Auth guard
	@Post('/add')
	@ThrowError('payments', 'create')
	async create(
		@Body() createPaymentsDto: ClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings | Error> {
		return await this.clientPaymentsSettingsService.create(createPaymentsDto)
	}

	// Auth guard
	@Get('/get/:id')
	@ThrowError('payments', 'getOne')
	getOne(@Param() getPaymentDto: GetClientPaymentsSettingsDto): Promise<ClientPaymentsSettings> {
		return this.clientPaymentsSettingsService.getOne(getPaymentDto)
	}

	// Auth guard
	@Get('/get/')
	@ThrowError('payments', 'getAll')
	getAll(
		@Body() getAllPaymentDto: GetAllClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings[]> {
		return this.clientPaymentsSettingsService.getAll(getAllPaymentDto)
	}

	// Auth guard
	@Put('/update/')
	@ThrowError('payments', 'update')
	async update(
		@Body() updatePaymentsDto: UpadteClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings | Error> {
		return await this.clientPaymentsSettingsService.update(updatePaymentsDto)
	}

	// Auth guard
	@Delete('/delete/')
	@ThrowError('payments', 'delete')
	delete(@Body() deletePaymentsDto: DeleteClientPaymentsSettingsDto): Promise<number> {
		return this.clientPaymentsSettingsService.delete(deletePaymentsDto)
	}

	@Post('/enable')
	@ThrowError('payments', 'enable')
	async enable(
		@Body() enableClientPaymentsSettingsDto: EnableClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings> {
		return await this.clientPaymentsSettingsService.enable(enableClientPaymentsSettingsDto)
	}
}
