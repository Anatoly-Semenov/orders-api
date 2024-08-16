import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as Sentry from '@sentry/node'
import { generateWorkingTime } from 'src/utils/generateWorkingTime'
import { CreateAddressDto } from './dto/create-address.dto'
import { EnableAddresseslDto } from './dto/enable-address.dto'
import { GetOneAddresseslDto } from './dto/get-one-address.dto'
import { UpdateAddressesDto } from './dto/update-address.dto'
import { Addresses } from './entities/address.entity'

@Injectable()
export class AddressesService {
	constructor(
		@InjectRepository(Addresses)
		private addressRepository: Repository<Addresses>,
	) {}
	async create(createAddressDto: CreateAddressDto): Promise<Addresses> {
		try {
			const workingTime = (await generateWorkingTime(createAddressDto?.workingTime)) || []

			const candidate = {
				...createAddressDto,
				workingTime,
				client: {
					id: createAddressDto.appId,
				},
			}
			return await this.addressRepository.save(candidate)
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException()
		}
	}

	async findAll(appId: number): Promise<Addresses[]> {
		try {
			return await this.addressRepository.find({
				where: {
					client: {
						id: appId,
					},
				},
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new NotFoundException(`Failed to find addresses with clientId: ${appId}`)
		}
	}

	async findOne(id: number, appId: number): Promise<Addresses> {
		try {
			return await this.addressRepository.findOne(id, {
				relations: ['files'],
				where: {
					client: {
						id: appId,
					},
				},
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new NotFoundException(`Failed to find addresses with id: ${id}, clientId: ${appId}`)
		}
	}

	async clone(id: number, appId: number, userId): Promise<Addresses> {
		try {
			const address = await this.addressRepository.findOne(id, {
				where: {
					client: {
						id: appId,
						ownerId: userId,
					},
				},
			})
			if (!address) throw new NotFoundException('Address not found')
			delete address.id
			return await this.addressRepository.save(address)
		} catch (error) {
			Sentry.captureException(error)

			throw new BadRequestException(`Failed to clone address with id: ${id}`)
		}
	}

	async update(
		id: number,
		appId: number,
		updateAddressesDto: UpdateAddressesDto,
		userId,
	): Promise<Addresses> {
		try {
			const address = await this.addressRepository.findOne(id, {
				relations: ['files'],
				where: {
					client: {
						id: appId,
						ownerId: userId,
					},
				},
			})
			if (!address) throw new NotFoundException('Address not found')
			const workingTime = (await generateWorkingTime(updateAddressesDto?.workingTime)) || []
			return await this.addressRepository.save({
				...address,
				...updateAddressesDto,
				files: [...address.files, ...updateAddressesDto.files],
				workingTime,
				id,
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException()
		}
	}

	async findAllSmallList(clientId: number) {
		try {
			return await this.addressRepository.find({
				select: ['id', 'isEnable', 'sortPosition', 'city', 'house', 'office', 'street', 'country'],
				where: {
					client: {
						id: +clientId,
					},
				},
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async delete(
		appId: number,
		getOneAddresseslDto: GetOneAddresseslDto,
		userId: number,
	): Promise<number> {
		const candidate = await this.addressRepository.findOne(getOneAddresseslDto.id, {
			where: {
				client: {
					id: appId,
					ownerId: userId,
				},
			},
		})
		if (!candidate) throw new NotFoundException('Address not found')

		const deleted = await this.addressRepository.delete({
			id: candidate.id,
		})
		return deleted.affected
	}

	async enable(
		appId: number,
		enableAddresseslDto: EnableAddresseslDto,
		userId,
	): Promise<Addresses> {
		try {
			const candidate = await this.addressRepository.findOne(enableAddresseslDto.id, {
				where: {
					client: {
						id: appId,
						ownerId: userId,
					},
				},
			})
			if (!candidate) throw new NotFoundException('Address not found')
			return await this.addressRepository.save(enableAddresseslDto)
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}
}
