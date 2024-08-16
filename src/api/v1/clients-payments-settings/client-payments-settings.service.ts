import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Clients } from '../clients/entities/clients.entity'
import { Repository } from 'typeorm'
import { DeleteClientPaymentsSettingsDto } from './dto/client-patments-settings-delete.dto'
import { GetClientPaymentsSettingsDto } from './dto/client-patments-settings-get.dto'
import { ClientPaymentsSettingsDto } from './dto/client-patments-settings.dto'
import { ClientPaymentsSettings } from './entities/clients-payments-settings.entity'
import { UpadteClientPaymentsSettingsDto } from './dto/client-patments-settings-update.dto'
import { GetAllClientPaymentsSettingsDto } from './dto/get-all-client-payments-settings.dto'
import { EnableClientPaymentsSettingsDto } from './dto/enable-payments-settings.dto'

@Injectable()
export class ClientPaymentsSettingsService {
	save(clientPaymentsSettingsDto: ClientPaymentsSettingsDto) {
		throw new Error('Method not implemented.')
	}
	constructor(
		@InjectRepository(ClientPaymentsSettings)
		private paymentsRepository: Repository<ClientPaymentsSettings>,
		@InjectRepository(Clients)
		private clientsRepository: Repository<Clients>,
	) {}

	async create(
		clientPaymentsSettingsDto: ClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings | Error> {
		const client = await this.clientsRepository.findOne(clientPaymentsSettingsDto.appId, {
			relations: ['users'],
		})

		if (!client) {
			throw new Error('client not found')
		}

		const user = client.users.filter((u) => {
			return u.id == clientPaymentsSettingsDto.userId
		})
		if (!user) {
			throw new Error('User not found')
		}

		return await this.paymentsRepository.save({
			...clientPaymentsSettingsDto,
			client,
		})
	}

	async getOne(
		getClientPaymentsSettingsDto: GetClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings> {
		return await this.paymentsRepository.findOne(getClientPaymentsSettingsDto.paymentId)
	}

	async getAll(
		getAllClientPaymentsSettingsDto: GetAllClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings[]> {
		return await this.paymentsRepository.find({
			where: {
				client: {
					id: getAllClientPaymentsSettingsDto.appId,
				},
			},
		})
	}

	async update(
		upadteClientPaymentsSettingsDto: UpadteClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings | Error> {
		const payment = await this.paymentsRepository.findOne(upadteClientPaymentsSettingsDto.paymentId)
		if (!payment) {
			throw new Error('payment settings not found')
		}
		return await this.paymentsRepository.save({
			...upadteClientPaymentsSettingsDto,
			client: {
				id: upadteClientPaymentsSettingsDto.appId,
			},
		})
	}

	async enable(
		enableClientPaymentsSettingsDto: EnableClientPaymentsSettingsDto,
	): Promise<ClientPaymentsSettings> {
		try {
			return await this.paymentsRepository.save(enableClientPaymentsSettingsDto)
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}
	async delete(deleteClientPaymentsSettingsDto: DeleteClientPaymentsSettingsDto): Promise<number> {
		const deleted = await this.paymentsRepository.delete({
			id: deleteClientPaymentsSettingsDto.paymentId,
		})
		return deleted.affected
	}
}
