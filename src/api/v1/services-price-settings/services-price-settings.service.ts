import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import * as Sentry from '@sentry/node'

import { CreateServicesPriceSettingDto } from './dto/create-services-price-setting.dto'
import { UpdateServicesPriceSettingDto } from './dto/update-services-price-setting.dto'

@Injectable()
export class ServicesPriceSettingsService {
	constructor(private servicesPriceSettingsRepository: any) {}

	private readonly logger = new Logger(ServicesPriceSettingsService.name)
	async create(createServicesPriceSettingDto: CreateServicesPriceSettingDto) {
		try {
			const candidate = {
				...createServicesPriceSettingDto,
				service: {
					id: createServicesPriceSettingDto.serviceId,
				},
			}
			return await this.servicesPriceSettingsRepository.save(candidate)
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async findAll(serviceId: number) {
		try {
			return await this.servicesPriceSettingsRepository.find({
				where: [
					{
						service: {
							id: serviceId,
						},
					},
				],
			})
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async findOne(serviceId: number, id: number) {
		try {
			return await this.servicesPriceSettingsRepository.findOne(id, {
				where: [
					{
						service: {
							id: serviceId,
						},
					},
				],
			})
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async update(id: number, updateServicesPriceSettingDto: UpdateServicesPriceSettingDto) {
		try {
			const candidate = await this.servicesPriceSettingsRepository.findOne(id)
			if (!candidate) {
				this.logger.error(`id: ${id} - Service settings not found`)
				throw new NotFoundException('Service settings not found')
			}
			return await this.servicesPriceSettingsRepository.save({
				id,
				...updateServicesPriceSettingDto,
			})
		} catch (error) {
			this.logger.error(error)
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async delete(id: number) {
		const deleted = await this.servicesPriceSettingsRepository.delete({ id })
		return deleted?.affected || 0
	}
}
