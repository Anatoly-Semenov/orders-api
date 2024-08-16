import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import * as _ from 'lodash'
import * as Sentry from '@sentry/node'
import { Users } from '../users/entities/users.entity'
import { Connection, In, Repository } from 'typeorm'
import { Clients } from './entities/clients.entity'
import { CreateClientDto } from './dto/create-clients.dto'
import { GetOneClientsDto } from './dto/get-one.dto'
import { RemoveClientsDto } from './dto/remove-clients.dto'
import { UpdateClientsDto } from './dto/update-clients.dto'
import { createClientEmail } from 'src/utils/notifications/notifications/emails'
import { NotificationsService } from 'src/utils/notifications/notifications.service'
import { ClientValidateDto } from './dto/client-validate.dto'
import { GetClientUsersDto } from './dto/get-client-users.dto'
import { EnableClientsDto } from './dto/enable-client.dto'
import { FilterClientsDto } from './dto/filter-clients.dto'
import { clientsFilterSql } from './sql/clients.sql'
import { UsersService } from '../users/users.service'
import { generateWorkingTime } from 'src/utils/generateWorkingTime'
import { AddressesService } from '../addresses/addresses.service'
import { EFilesTags } from '../files/enums/files.enum'
import { CaddyService } from '../caddy/caddy.service'
import { Addresses } from '../addresses/entities/address.entity'
import { GetClientIdByAliasDto } from './dto/get-id-by-alias.dto'
import { GetIdByAliasResponseDto } from './dto/response/get-id-by-alias-response.dto'
import { forbiddenAliasList } from './constants'
import { CreateMerchantShopDto } from './dto/create-merchant-shop.dto'
import { EPaymentProvider } from '../payments/enums/payments.enum'
import { PaymentsService } from '../payments/payments.service'
import { CreateMerchantShopInTinkoffDto } from '../payments/dto/tinkoff/create-merchant-shop-in-tinkoff.dto'
import { ClientIntegration } from './entities/client-integration.entity'
import { CreateClientsIntegrationDto } from './dto/create-client-integration.dto'
import { UpdateClientIntegrationDto } from './dto/update-client-integration.dto'
import { GetClientCustomersDto } from './dto/get-client-customers.dto'
import { OrderCustomer } from '../orders/entities/order-customer.entity'
import { GetAllSmallListResponseDto } from './dto/response/get-all-small-list.response.dto'
import { GetClientTimeStepResponseDto } from './dto/response/get-client-time-step.response.dto'

@Injectable()
export class ClientsService {
	save(createClientDto: CreateClientDto) {
		throw new Error('Method not implemented.')
	}
	constructor(
		@InjectRepository(Clients)
		private clientsRepository: Repository<Clients>,
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
		@InjectRepository(Addresses)
		private addressesRepository: Repository<Addresses>,
		@InjectRepository(ClientIntegration)
		private clientIntegrationsRepository: Repository<ClientIntegration>,
		private readonly notificationService: NotificationsService,
		private readonly connection: Connection,
		private readonly usersServices: UsersService,
		private readonly addressesService: AddressesService,
		private readonly caddyService: CaddyService,
		private readonly paymentService: PaymentsService,
	) {}

	private readonly logger = new Logger(ClientsService.name)

	async filter(f: FilterClientsDto): Promise<any> {
		const queryString = clientsFilterSql(f)
		const dbResult: any[] = await this.connection.query(queryString)
		return dbResult || []
	}

	async create(createClientDto: CreateClientDto, userId: number): Promise<Clients> {
		const { secretKey, testSecretKey } = await this.createKeys()

		const usersArray: any = [
			{
				id: userId,
			},
		]
		if (createClientDto.users) {
			for (const u of createClientDto?.users) {
				const { newUser } = await this.usersServices.createUserObject(u)
				usersArray.push(newUser)
			}
		}
		const addresses = []
		if (createClientDto?.addresses?.length) {
			for (const address of createClientDto.addresses) {
				addresses.push({
					...address,
					workingTime: await generateWorkingTime(address.workingTime),
				})
			}
		}

		const newClientData: any = {
			...createClientDto,
			secretKey,
			testSecretKey,
			owner: {
				id: userId,
			},
			users: usersArray,
			addresses,
		}

		const isAliasInDto = !!createClientDto.idAlias
		if (isAliasInDto) {
			const transformedAlias: string = this.transformAliasToAccepted(createClientDto.idAlias)
			this.validateClientAlias(transformedAlias)
			newClientData.idAlias = transformedAlias
		} else if (!isAliasInDto) {
			newClientData.idAlias = uuidv4()
		}

		const newClient = await this.clientsRepository.save(newClientData)

		if (!isAliasInDto) {
			const newClientId: number = newClient.id
			await this.clientsRepository.update(newClientId, {
				idAlias: newClientId.toString(),
			})
		}

		const user = this.usersRepository.findOne(userId)
		return Promise.all([newClient, user]).then(async (result) => {
			///caddy
			this.caddyService.addSublcienthost(result[0].id)
			await this.notificationService.sendEmail(result[1].userEmail, createClientEmail(), {
				subject: 'New company',
			})
			return result[0]
		})
	}

	validateClientAlias(idAlias: string) {
		if (forbiddenAliasList.includes(idAlias)) {
			throw new BadRequestException('Forbidden alias for company')
		}
	}

	transformAliasToAccepted(idAlias: string | undefined) {
		if (!idAlias) {
			throw new BadRequestException('Company alias should not be empty')
		}

		const result: string = idAlias.toLowerCase()
		return result.replace(/_/g, '-')
	}

	async getAll(userId: number): Promise<Clients[]> {
		try {
			const clients = await this.clientsRepository
				.createQueryBuilder('clients')
				.leftJoinAndSelect('clients.users', 'user')
				.where('user.id = :userId', { userId: userId })
				.orWhere('"ownerId" = :userId', { userId: userId })
				.getMany()

			return clients
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	async findAllSmallList(userId: number): Promise<GetAllSmallListResponseDto[]> {
		try {
			const clients = await this.clientsRepository
				.createQueryBuilder('clients')
				.leftJoinAndSelect('clients.users', 'user')
				.where('user.id = :userId', { userId: userId })
				.orWhere('"ownerId" = :userId', { userId: userId })
				.getMany()

			return clients.map((client) => {
				return {
					id: client.id,
					clientName: client.clientName,
					isEnable: client.isEnable,
				}
			})
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	async checkServices(appId, userId: number) {
		try {
			const result = await this.clientsRepository.findOne(appId, {
				relations: ['services'],
			})

			if (result && userId) {
				const accessUser = result.users?.some((user) => user.id == userId) || false
				if (!accessUser) {
					throw new ForbiddenException('Access to the company is forbidden')
				}
			}

			return !!result?.services?.length
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}
	async getOne(
		getOneClientDto: GetOneClientsDto,
		excludeServices = 0,
		userId: number | undefined = undefined,
	): Promise<Clients> {
		let relations = []
		let client
		if (!excludeServices) {
			relations = ['services']
			client = await this.clientsRepository.findOne(getOneClientDto.appId, {
				relations: relations,
			})
		} else {
			client = await this.clientsRepository.findOne(getOneClientDto.appId)
		}

		if (client && userId) {
			const accessUser = client.users?.some((user) => user.id == userId) || false
			if (!accessUser) {
				throw new ForbiddenException('Access to the company is forbidden')
			}
		}

		if (!client) throw new NotFoundException('Company not found')
		return client
	}
	async getIdByAlias(getIdByAliasDto: GetClientIdByAliasDto): Promise<GetIdByAliasResponseDto> {
		const client: Clients = await this.clientsRepository
			.createQueryBuilder('client')
			.select('client.id')
			.where('client.idAlias = :alias', { alias: getIdByAliasDto.idAlias })
			.getOne()

		if (!client) throw new NotFoundException('Company not found')

		return client
	}
	async getClientTimeStep(
		getOneClientDto: GetOneClientsDto,
		userId,
	): Promise<GetClientTimeStepResponseDto> {
		const client = await this.clientsRepository.findOne(getOneClientDto.appId, {
			relations: ['users'],
		})

		if (!client) throw new NotFoundException('Company not found')

		if (client.owner.id !== userId && !client.users.find((user) => user.id === userId)) {
			throw new NotFoundException('Company not found')
		}

		return { calendarTimeStep: client.calendarTimeStep }
	}

	async accessClient(getOneClientDto: GetOneClientsDto, userId) {
		const client = await this.clientsRepository.findOne(getOneClientDto.appId)

		const accessUser = client?.users?.some((user) => user.id == userId) || false

		return accessUser
	}

	async clone(getOneClientDto: GetOneClientsDto, userId: number): Promise<Clients | Error> {
		const candidate: any = await this.clientsRepository.findOne(getOneClientDto.appId, {
			relations: ['services'],
			where: {
				owner: {
					id: userId,
				},
			},
		})

		if (candidate) {
			const newClientCandidate = JSON.parse(JSON.stringify(candidate))
			delete newClientCandidate.id
			newClientCandidate.addresses =
				newClientCandidate?.addresses?.map((add) => {
					add = _.omit(add, ['id'])
					add.workingTime = add?.workingTime?.map((wt) => _.omit(wt, ['id'])) || []
					return add
				}) || []

			newClientCandidate.services = newClientCandidate?.services?.map((s) => {
				s = _.omit(s, ['id'])
				s.additionalServices =
					s?.additionalServices?.map((as) => {
						return {
							...as,
							parentServices: [],
						}
					}) || []
				s.additionalServices =
					s?.additionalServices?.map((as) => {
						as = _.omit(as, ['id'])
						as.parentServices = [...s]
						return as
					}) || []
				s.additionalEnableServices = []
				return s
			})

			for (let i = 1; i <= newClientCandidate.copyVersion; i++) {
				newClientCandidate.clientName = `${candidate.clientName}_copy(${i})`
			}

			const { secretKey, testSecretKey } = await this.createKeys()
			const [oldClient, newClient] = await this.clientsRepository.save([
				{
					id: candidate.id,
					copyVersion: candidate.copyVersion + 1,
				},
				{
					...newClientCandidate,
					secretKey,
					testSecretKey,
					isEnable: false,
					files: [],
				},
			])
			return newClient
		}

		throw new Error('Client app not found')
	}

	async update(updateClientsDto: UpdateClientsDto, userId): Promise<Clients | Error> {
		const client = await this.clientsRepository.findOne(updateClientsDto.id, {
			relations: ['services'],
			where: {
				owner: {
					id: userId,
				},
			},
		})

		if (client) {
			if (updateClientsDto.idAlias) {
				const transformedAlias: string = this.transformAliasToAccepted(updateClientsDto.idAlias)
				this.validateClientAlias(transformedAlias)
				client.idAlias = transformedAlias
			}
			const meta = {
				...client.meta,
				...updateClientsDto.meta,
			}
			if (updateClientsDto?.files?.some((file) => file.tag == EFilesTags.Logo)) {
				client.files = [
					...(client?.files?.filter((file) => file.tag != EFilesTags.Logo) || []),
					...updateClientsDto.files.filter((file) => file.tag == EFilesTags.Logo),
				]
			}
			const addressPromises = []
			const addresses = []
			const addressIds = []
			if (updateClientsDto.addresses.length) {
				for (const address of updateClientsDto.addresses) {
					if (address.id) {
						addressIds.push(address.id)
						const clientAddress: Promise<Addresses> = this.addressesService.findOne(
							address.id,
							updateClientsDto.id,
						)
						addressPromises.push({ ...clientAddress, ...address })
					} else {
						addresses.push({
							...address,
							workingTime: await generateWorkingTime(address.workingTime),
						})
					}
				}
			}

			return Promise.allSettled(addressPromises)
				.then(async (result: any) => {
					result = result.map((r) => r.value)
					for (const i in result) {
						result[i].workingTime = await generateWorkingTime(result[i].workingTime)
					}
					const clientResult = await this.clientsRepository.save({
						...client,
						...updateClientsDto,
						addresses: [...result, ...addresses],
						meta,
						users: [...(client.users || []), ...(updateClientsDto?.users || [])],
					})

					if (client.addresses.length) {
						const removedAddressesIds = []

						client.addresses.forEach((address) => {
							if (!addressIds.includes(address.id)) {
								removedAddressesIds.push(address.id)
							}
						})

						if (removedAddressesIds.length) {
							await this.addressesRepository.softDelete(removedAddressesIds)
						}
					}

					return clientResult
				})
				.catch((error) => {
					Sentry.captureException(error)
					throw new InternalServerErrorException(error)
				})
		}
		throw new NotFoundException('App not found')
	}

	async enable(enableClientsDto: EnableClientsDto): Promise<Clients> {
		try {
			return this.clientsRepository.save(enableClientsDto)
		} catch (error) {
			Sentry.captureException(error)
			throw new NotFoundException('App not found')
		}
	}

	async delete(removeClientsDto: RemoveClientsDto, userId: number): Promise<number> {
		const client = await this.clientsRepository.findOne({
			relations: ['services'],
			where: {
				id: removeClientsDto.appId,
				owner: {
					id: userId,
				},
			},
		})
		if (client) {
			const remove = await this.clientsRepository.delete({
				id: client.id,
			})
			return remove.affected
		}
		return 0
	}

	async getUsers(getClientUsersDto: GetClientUsersDto, userId): Promise<Users[]> {
		const candidate = await this.clientsRepository.findOne(getClientUsersDto.appId, {
			relations: ['users'],
		})
		if (!candidate) throw new NotFoundException('App not found')

		if (candidate.owner.id !== userId && !candidate.users.find((user) => user.id === userId)) {
			throw new NotFoundException('App not found')
		}

		return candidate?.users
	}

	async getCustomers(getClientCustomersDto: GetClientCustomersDto): Promise<OrderCustomer[]> {
		let clients: any = this.clientsRepository
			.createQueryBuilder('clients')
			.select(['clients.id'])
			.leftJoinAndSelect('clients.orders', 'orders')
			.leftJoinAndMapMany(
				'orders.customers',
				OrderCustomer,
				'orderCustomers',
				'orderCustomers.id = orders.customerId',
			)
			.andWhere('clients.id = :id', {
				id: getClientCustomersDto.appId,
			})

		clients = await clients.getMany()
		if (!clients) throw new NotFoundException('App not found')

		let customers = []
		clients.forEach((item) => {
			item.orders?.forEach((order) => {
				customers = customers.concat(order.customers)
			})
		})

		const customersMap: Record<number, OrderCustomer> = {}
		customers.forEach((item) => {
			customersMap[item.id] = item
		})

		return Object.values(customersMap)
	}

	async createKeys(): Promise<any> {
		const secretKey = 'pb' + (await bcrypt.hash(uuidv4() + new Date(), 13))
		const testSecretKey = 'test' + (await bcrypt.hash(uuidv4() + new Date(), 13))

		return { secretKey, testSecretKey }
	}

	async clientValidate(clientValidate: ClientValidateDto): Promise<any> {
		const findObj = {
			id: clientValidate.username,
			secretKey: clientValidate.password,
		}

		const candidate = await this.clientsRepository.findOne(findObj)
		if (!candidate) {
			throw new Error('Unknown client app')
		}

		return true
	}

	async createMerchantShop(dto: CreateMerchantShopDto & CreateMerchantShopInTinkoffDto) {
		try {
			const client = await this.clientsRepository.findOne(dto.id)

			const updateClient = await this.clientsRepository.manager.transaction(async (manager) => {
				const createMerchantShopDto = JSON.parse(JSON.stringify(dto))
				const createMerchantShopInTinkoff = await this.paymentService.createMerchantShop({
					// client,
					...createMerchantShopDto,
					bankAccount: {
						...dto.bankAccount,
						tax: client.id === 5 ? 2.6 : 2.99,
						details:
							'Перевод средств по договору оферты по Реестру операций от ${date}. Сумма комиссии ${rub} руб. ${kop} коп., НДС не облагается.',
					},
					siteUrl: dto.siteUrl || `https://${client.idAlias}.${process.env.FRONTEND_HOST}`,
					provider: EPaymentProvider.TINKOFF,
				})
				if (createMerchantShopInTinkoff?.shopCode) {
					delete dto.id
					const merchantData = {
						...dto,
						siteUrl: dto.siteUrl || `https://${client.idAlias}.${process.env.FRONTEND_HOST}`,
						code: createMerchantShopInTinkoff.code,
						shopCode: createMerchantShopInTinkoff?.shopCode,
						terminals: createMerchantShopInTinkoff?.terminals || [],
					}

					const candidate = this.clientsRepository.create({
						id: client.id,
						merchantData,
					})
					const result = await manager.save(candidate)
					return result
				} else {
					throw createMerchantShopInTinkoff
				}
			})
			return updateClient
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	async createClientIntegrations(dto: CreateClientsIntegrationDto) {
		try {
			return this.clientIntegrationsRepository.save({
				...dto,
				client: {
					id: dto.clientId,
				},
			})
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	async updateClientIntegrations(dto: UpdateClientIntegrationDto) {
		try {
			return await this.clientIntegrationsRepository.save({
				...dto,
				client: {
					id: dto.clientId,
				},
			})
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	async getOneClientIntegration(clientId: number, integrationId: number) {
		try {
			return await this.clientIntegrationsRepository.findOne({
				where: {
					id: integrationId,
					client: {
						id: clientId,
					},
				},
			})
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	async getAllClientIntegration(clientId: number) {
		try {
			return await this.clientIntegrationsRepository.find({
				where: {
					client: {
						id: clientId,
					},
				},
			})
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	async deleteClientIntegration(integrationId: number) {
		try {
			const candidate = await this.clientIntegrationsRepository.findOne({
				where: {
					id: integrationId,
				},
			})
			return this.clientIntegrationsRepository.delete(candidate)
		} catch (error) {
			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}
	async getMerchantShop(clientId: string) {
		const client: Clients = await this.clientsRepository
			.createQueryBuilder('client')
			.leftJoinAndSelect('client.merchantData', 'merchantData')
			.where('client.id = :id', { id: clientId })
			.getOne()

		if (!client) throw new NotFoundException('Company not found')
		if (!client.merchantData) throw new NotFoundException('Merchant not found')

		return client.merchantData
	}
}
