import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as Sentry from '@sentry/node'

import { Connection, In, Not, Repository } from 'typeorm'
import { ChangePositionServiceDto } from './dto/change-position-service.dto'
import { CreateServicesDto } from './dto/create-services.dto'
import { ServicesDeleteManyDto } from './dto/delete-many-service.dto'
import { CustomerCanViewDto } from './dto/customer-can-view.dto'
import { UpdateServicesDto } from './dto/update-services.dto'
import { Services } from './entities/services.entity'
import { FindAllServicesDto } from './dto/find-all-services.dto'
import * as _ from 'lodash'
import { ServicesTarget } from './entities/service-target.entity'
import { AddTargetDto } from './dto/add-target.dto'
import { UpdateTargetDto } from './dto/update-target.dto'
import { AdditionalEnableServices } from './entities/additional-enable-services.entity'
import { CloneServiceDto } from './dto/clone-service.dto'
import { GetServicePriceDto } from './dto/get-service-price.dto'
import { ServicePriceLib } from 'src/utils/service-price-lib-main/src/ServicePriceLib'
import { recurrentIdClear } from 'src/utils/RecurrentIdClear.util'
import { defaultLimit, defaultOffset } from './constants'
import { ServicesSmallListSubClientDto } from './dto/response/services-small-list-subclient.response.dto'
import { EServiceTypes, EAdditionalTypes } from './enums/service.enum'
import { Files } from '../files/entity/files.entity'

@Injectable()
export class ServicesService {
	constructor(
		@InjectRepository(Services)
		private servicesRepository: Repository<Services>,
		@InjectRepository(ServicesTarget)
		private servicesTargetRepository: Repository<ServicesTarget>,
		@InjectRepository(AdditionalEnableServices)
		private additionalEnableServices: Repository<AdditionalEnableServices>,
		@InjectRepository(Files)
		private filesRepository: Repository<Files>,
		private readonly connection: Connection,
	) {}
	private readonly logger = new Logger(ServicesService.name)

	async create(createServicesDto: CreateServicesDto): Promise<Services> {
		let candidate

		try {
			if (!createServicesDto.clientId)
				throw new InternalServerErrorException('clietnId is required')
			if (!createServicesDto?.title) {
				delete createServicesDto.title
			}
			if (createServicesDto?.additionalServices?.length) {
				createServicesDto.additionalEnableServices = [
					...(createServicesDto?.additionalServices?.map((as) => {
						return {
							childrenId: as.id,
							isEnable: as.isEnable || false,
							customerCanView: as.customerCanView || false,
						}
					}) || []),
				]
				createServicesDto.additionalServices =
					createServicesDto?.additionalServices?.map((s) => {
						return {
							...s,
							client: {
								id: createServicesDto.clientId,
							},
						}
					}) || []
			}
			createServicesDto.priceSettings =
				createServicesDto?.priceSettings?.map((ps) => {
					if (ps.action !== 'const') {
						ps.dateStart = ps?.dateStart || null
						ps.dateEnd = ps.dateEnd || null

						return ps
					}
					return ps
				}) || null

			candidate = {
				...createServicesDto,
				target: createServicesDto?.target?.join(',') || '',
				client: {
					id: createServicesDto.clientId,
				},
			}

			if (candidate.type === EServiceTypes.Additional && !candidate.additionalType) {
				candidate.additionalType = EAdditionalTypes.REQUISITE
			}

			delete candidate.clientId

			if (!candidate?.client?.id) throw new InternalServerErrorException('client.id is reqired')
			return await this.servicesRepository.save(candidate)
		} catch (error) {
			await this.servicesRepository.save({ ...candidate, isValid: false })

			Sentry.captureException(error)
			this.logger.error(error)

			throw new InternalServerErrorException(error)
		}
	}

	async findAll(clientId: number, findAllServicesDto: FindAllServicesDto): Promise<Services[]> {
		try {
			let type
			if (findAllServicesDto?.type?.length) {
				type = {
					type: In(findAllServicesDto.type),
				}
			} else if (findAllServicesDto?.exclude?.length) {
				type = {
					type: Not(In(findAllServicesDto?.exclude)),
				}
			}

			const result: any = await this.servicesRepository.find({
				where: {
					client: {
						id: clientId,
					},

					...type,
					isDeleted: findAllServicesDto.isDeleted == 'true' ? true : false,
				},
				skip: findAllServicesDto.offset || 0,
				take: findAllServicesDto.limit || 25,
			})

			for (const i in result) {
				let additionalEnableSerivcesPromise
				let additionalServicesPromise
				let parentPromise
				if (result[i].type === EServiceTypes.Rent) {
					additionalServicesPromise = this.servicesRepository
						.createQueryBuilder('service')
						.select([
							'service.id',
							'service.type',
							'service.title',
							'service.customerCanView',
							'service.isEnable',
							'service.isDeleted',
							'service.isRequire',
							'service.sortPosition',
							'service.price',
							'service.additionalType',
							'service.paymentType',
							'service.paymentAmount',
						])
						.leftJoin(
							'service_parent_additional',
							'service_parent_additional',
							'service_parent_additional.servicesId_1 = :id',
							{ id: result[i].id },
						)
						.where('service.isDeleted = false')
						.andWhere('service.id = service_parent_additional.servicesId_2')
						.getMany()

					additionalEnableSerivcesPromise = this.additionalEnableServices.find({
						where: {
							parent: {
								id: result[i].id,
							},
						},
					})
				} else if (result[i].type == EServiceTypes.Additional) {
					parentPromise = this.servicesRepository
						.createQueryBuilder('service')
						.select([
							'service.id',
							'service.type',
							'service.title',
							'service.customerCanView',
							'service.isEnable',
							'service.isDeleted',
							'service.isRequire',
							'service.price',
							'service.sortPosition',
						])
						.leftJoin(
							'service_parent_additional',
							'service_parent_additional',
							'service_parent_additional.servicesId_2 = :id',
							{ id: result[i].id },
						)

						.where('service.id = service_parent_additional.servicesId_1')
						.getMany()
				}
				const filesPromise = this.filesRepository.find({
					where: {
						services: {
							id: result[i].id,
						},
					},
				})

				// eslint-disable-next-line prefer-const
				let [additionalServices, additionalEnableSerivces, files, parentServices] =
					await Promise.all([
						additionalServicesPromise,
						additionalEnableSerivcesPromise,
						filesPromise,
						parentPromise,
					])

				result[i].additionalServices = additionalServices || []
				result[i].additionalEnableSerivces = additionalEnableSerivces || []
				result[i].files = files || []
				result[i].parentServices = parentServices || []
			}

			return result.map((r) => {
				r = _.omit(r, ['additionalEnableServices'])
				if (r?.priceSettings?.length) {
					r.priceSettings = r.priceSettings.map((rp) => {
						rp.dateEnd = rp.dateEnd ? rp.dateEnd : null
						rp.dateStart = rp.dateStart ? rp.dateStart : null
						return rp
					})
				}
				return {
					...r,
					additionalServices:
						r?.additionalServices?.map((a: any) => {
							if (r?.additionalEnableServices?.length) {
								const findFromResult = r?.additionalEnableServices?.find(
									(ars) => ars?.childrenId == a.id,
								)
								a.isEnable = findFromResult?.isEnable || false
								a.isRequire = findFromResult?.isRequire || false
								a.customerCanView = findFromResult?.customerCanView || false
							}

							return a
						}) || [],
					targets: r?.targets?.length ? r.targets.filter((t) => t.isDeleted === false) : [],
				}
			})
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async findAllSmallDataForSubclient(
		clientId: number,
		findAllServicesDto: FindAllServicesDto,
	): Promise<[ServicesSmallListSubClientDto]> {
		let result: any = this.servicesRepository
			.createQueryBuilder('service')
			.leftJoinAndSelect('service.addresses', 'addresses')
			.leftJoinAndSelect('service.files', 'file')
			.where('service.client.id = :clientId', { clientId })
			.andWhere('service.isDeleted = :isDeleted', {
				isDeleted: findAllServicesDto.isDeleted == 'true' ? true : false,
			})

		if (findAllServicesDto.type?.length) {
			const types = Array.isArray(findAllServicesDto.type)
				? findAllServicesDto.type
				: [findAllServicesDto.type]
			result = result.andWhere('service.type IN (:...types)', {
				types,
			})
		} else if (findAllServicesDto.exclude?.length) {
			const types = Array.isArray(findAllServicesDto.exclude)
				? findAllServicesDto.exclude
				: [findAllServicesDto.exclude]
			result = result.andWhere('service.type NOT IN (:...types)', {
				types,
			})
		}

		result = await result
			.skip(findAllServicesDto.offset || defaultOffset)
			.take(findAllServicesDto.limit || defaultLimit)
			.getMany()

		return result.map((r) => {
			r = _.omit(r, ['prepaymentParams'])
			if (r?.priceSettings?.length) {
				r.priceSettings = r.priceSettings.map((rp) => {
					rp.dateEnd = rp.dateEnd ? rp.dateEnd : null
					rp.dateStart = rp.dateStart ? rp.dateStart : null
					return rp
				})
			}
			return r
		})
	}

	async findAllSmallList(
		clientId: number,
		findAllServicesDto: FindAllServicesDto,
	): Promise<Services[]> {
		try {
			let type

			if (findAllServicesDto?.type?.length) {
				type = {
					type: In(findAllServicesDto.type),
				}
			} else if (findAllServicesDto?.exclude?.length) {
				type = {
					type: Not(In(findAllServicesDto?.exclude)),
				}
			}

			return await this.servicesRepository.find({
				select: [
					'id',
					'title',
					'type',
					'sortPosition',
					'customerCanView',
					'additionalType',
					'paymentType',
					'paymentAmount',
					'isEnable',
					'isDeleted',
					'isRequire',
					'price',
					'isValid',
				],
				where: {
					client: {
						id: clientId,
					},
					...type,
					isDeleted: findAllServicesDto.isDeleted == 'true' ? true : false,
				},
			})
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async findOne(clientId: number, id: number): Promise<Services> {
		try {
			const result = await this.servicesRepository.findOne(id, {
				where: {
					client: {
						id: clientId,
					},
					isDeleted: false,
				},
			})
			let additionalSerivcesPromise
			let additionalEnableSerivcesPromise
			let parentServices
			let filesPromise
			if (result.type == EServiceTypes.Rent) {
				const qb = this.servicesRepository.createQueryBuilder('service')

				additionalSerivcesPromise = qb
					.leftJoinAndSelect(
						'service_parent_additional',
						'service_parent_additional',
						'service_parent_additional.servicesId_1 = :id',
						{ id },
					)
					.select([
						'service.id',
						'service.type',
						'service.title',
						'service.customerCanView',
						'service.isEnable',
						'service.isDeleted',
						'service.isRequire',
						'service.price',
						'service.additionalType',
						'service.paymentType',
						'service.paymentAmount',
					])

					.where('service.isDeleted = false')
					.andWhere('service.id = service_parent_additional.servicesId_2')
					.getMany()

				additionalEnableSerivcesPromise = this.additionalEnableServices.find({
					where: {
						parent: {
							id,
						},
					},
				})

				filesPromise = this.filesRepository.find({
					where: {
						services: {
							id,
						},
					},
				})
			} else if (result.type == EServiceTypes.Additional) {
				parentServices = await this.servicesRepository
					.createQueryBuilder('service')
					.select([
						'service.id',
						'service.type',
						'service.title',
						'service.customerCanView',
						'service.isEnable',
						'service.isDeleted',
						'service.isRequire',
						'service.price',
						'service.sortPosition',
					])
					.leftJoin(
						'service_parent_additional',
						'service_parent_additional',
						'service_parent_additional.servicesId_2 = :id',
						{ id },
					)

					.where('service.id = service_parent_additional.servicesId_1')
					.getMany()
			}
			// eslint-disable-next-line prefer-const
			let [additionalServices, additionalEnableServices, files] = await Promise.all([
				additionalSerivcesPromise,
				additionalEnableSerivcesPromise,
				filesPromise,
			])

			if (result && additionalServices) {
				additionalServices =
					additionalServices?.map((a: any) => {
						if (additionalEnableServices?.length) {
							const findFromResult = additionalEnableServices?.find(
								(ars) => ars?.childrenId == a.id,
							)
							a.isEnable = findFromResult?.isEnable || false
							a.isRequire = findFromResult?.isRequire || false
							a.customerCanView = findFromResult?.customerCanView || false
						}

						return a
					}) || []
			}
			if (result?.targets?.length) {
				result.targets = result?.targets?.length
					? result.targets.filter((t) => t.isDeleted === false)
					: []
			}
			result.priceSettings =
				result?.priceSettings?.map((rp) => {
					rp.dateEnd = rp.dateEnd ? rp.dateEnd : null
					rp.dateStart = rp.dateStart ? rp.dateStart : null
					return rp
				}) || []

			return {
				...result,
				additionalServices,
				parentServices,
				files,
			}
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async update(id: number, updateServicesDto: UpdateServicesDto): Promise<Services> {
		try {
			const service = await this.servicesRepository.findOne(id)

			if (!service) {
				this.logger.error(`id ${id} - setvice not found`)
				throw new NotFoundException(`id ${id} - service not found`)
			}

			const sourceAdditionalServices = {}
			if (updateServicesDto?.additionalServices?.length) {
				updateServicesDto.additionalEnableServices = [
					...(updateServicesDto?.additionalServices?.map((as) => {
						return {
							childrenId: as.id,
							isEnable: as.isEnable || false,
							isRequire: as.isRequire || false,
							customerCanView: as.customerCanView || false,
						}
					}) || []),
				]

				updateServicesDto.additionalServices =
					updateServicesDto?.additionalServices?.map((s) => {
						sourceAdditionalServices[s.id] = s
						return _.pick(s, ['id'])
					}) || []
			}
			updateServicesDto.priceSettings =
				updateServicesDto?.priceSettings?.map((ps) => {
					if (ps.action !== 'const') {
						ps.dateStart = ps.dateStart
						ps.dateEnd = ps.dateEnd ? ps.dateEnd : null
					}
					return ps
				}) || null
			await this.additionalEnableServices.delete({
				parent: {
					id: id,
				},
				childrenId: In(
					updateServicesDto?.additionalEnableServices?.map((aes) => aes?.childrenId) || [],
				),
			})

			if (updateServicesDto.parentServices) {
				const deleteOldRelations = this.connection.query(
					`DELETE FROM service_parent_additional WHERE "servicesId_2" = ${id}`,
				)

				const createNewRelations =
					updateServicesDto?.parentServices?.length &&
					this.connection.query(
						`INSERT INTO service_parent_additional ("servicesId_1", "servicesId_2") VALUES ${updateServicesDto.parentServices
							.map((ps) => `(${ps.id}, ${id})`)
							.join(', ')}`,
					)

				Promise.all([deleteOldRelations, createNewRelations])
			}

			const candidate = {
				id,
				...updateServicesDto,
			}

			let result: any = await this.servicesRepository.save(candidate)

			if (result?.additionalEnableServices?.length) {
				result.additionalServices =
					result?.additionalServices?.map((r) => {
						const findFromResult = result.additionalEnableServices.find((a) => a.childrenId == r.id)
						r.isEnable = findFromResult.isEnable
						r.customerCanView = findFromResult.customerCanView
						r.isRequire = findFromResult.isRequire
						return {
							...sourceAdditionalServices[r.id],
							...r,
						}
					}) || []
			}
			result = _.omit(result, ['additionalEnableServices'])

			return result
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async delete(id: number): Promise<any> {
		return await this.servicesRepository.save({ id, isDeleted: true })
	}

	async deleteMany(servicesDeleteManyDto: ServicesDeleteManyDto): Promise<any> {
		const deleted = await this.servicesRepository.delete(servicesDeleteManyDto.ids)
		return deleted.affected || 0
	}

	async customerCanView(customerCanViewDto: CustomerCanViewDto, id: number): Promise<any> {
		try {
			const service = await this.servicesRepository.update(id, customerCanViewDto)

			return service.affected
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async getTargets(serviceId: number): Promise<any> {
		try {
			return await this.servicesTargetRepository.find({
				where: {
					services: {
						id: serviceId,
					},
					isDeleted: false,
				},
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async addTarget(serviceId: number, addTargetDto: AddTargetDto): Promise<any> {
		try {
			return await this.servicesTargetRepository.save({
				services: {
					id: serviceId,
				},
				...addTargetDto,
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async updateTarget(targetId: number, updateTargetDto: UpdateTargetDto): Promise<any> {
		try {
			const result = await this.servicesTargetRepository.save({
				id: targetId,
				...updateTargetDto,
			})
			return result
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async deleteTargets(targetId: number): Promise<any> {
		try {
			const result = await this.servicesTargetRepository.save({
				id: targetId,
				isDeleted: true,
			})
			return result
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async deleteManyTargets(serviceId: number): Promise<any> {
		try {
			let targets = await this.servicesTargetRepository
				.createQueryBuilder('targets')
				.leftJoin('targets.services', 'services')
				.where('services.id = :serviceId', { serviceId })
				.getMany()
			targets = targets.map((t) => {
				return {
					...t,
					isDeleted: true,
				}
			})
			return await this.servicesTargetRepository.save(targets)
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async addManyTarget(serviceId: number, addTargetDto: AddTargetDto[]): Promise<any> {
		try {
			addTargetDto = addTargetDto.map((a) => {
				return {
					...a,
					services: {
						id: serviceId,
					},
				}
			})

			return await this.servicesTargetRepository.save(addTargetDto)
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async changePosition(changePositionServiceDto: ChangePositionServiceDto[]): Promise<any> {
		try {
			return await this.servicesRepository.save(changePositionServiceDto)
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async clone(cloneServiceDto: CloneServiceDto): Promise<any> {
		try {
			const service = await this.servicesRepository.findOne(cloneServiceDto.id, {
				relations: [
					'category',
					'client',
					'additionalEnableServices',
					'additionalServices',
					'parentServices',
				],
			})

			let newService = JSON.parse(JSON.stringify(service))

			if (newService) {
				newService = _.omit(newService, ['files', 'orders'])

				if (newService.priceSettings?.length) {
					const settingsMap = new Map()
					service.priceSettings.forEach((item) => {
						if (item.target?.id) {
							settingsMap.set(Number(item.target.id), item)
						}
					})
					newService.targets.forEach((item) => {
						const settings = settingsMap.get(item.id)
						if (settings) {
							item.priceSettings = settings
						}
					})
				}

				newService = await recurrentIdClear(newService, [
					'client',
					'addresses',
					'users',
					'owner',
					'additionalServices',
					'target',
				])

				for (let i = 1; i <= newService.copyVersion; i++) {
					newService.title = `${newService.title}_copy(${i})`
				}

				await this.servicesRepository.update(service.id, {
					copyVersion: service.copyVersion + 1,
				})

				let result = await this.servicesRepository.save(newService)

				if (newService.priceSettings?.length) {
					const priceSettings = []
					newService.targets.forEach((item) => {
						if (item.priceSettings) {
							priceSettings.push({
								...item.priceSettings,
								target: {
									id: item.id,
								},
							})
						}
					})
					if (priceSettings.length) {
						await this.servicesRepository.update(result.id, {
							priceSettings,
						})
						result = await this.servicesRepository.findOne(result.id, {
							relations: [
								'category',
								'client',
								'additionalEnableServices',
								'additionalServices',
								'parentServices',
							],
						})
					}
				}

				return result
			}
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async getServicePrice(serviceId: number, getServicePriceDto: GetServicePriceDto): Promise<any> {
		try {
			const service = await this.servicesRepository.findOne(serviceId, {
				relations: [
					'additionalServices',
					'additionalEnableServices',
					'targets',
					'addresses',
					'files',
					'parentServices',
				],
			})
			const result = new ServicePriceLib(service).getParamFromOptions({
				dateStart: new Date(getServicePriceDto.dateStart),
				dateEnd: new Date(getServicePriceDto.dateEnd),
				amountPeople: getServicePriceDto.amountPeople,
				target: +getServicePriceDto.target,
			})
			return { price: result?.calcPrice() || 0 }
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}
}
