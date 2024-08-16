import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRateDto } from './dto/create-rate.dto'
import { UpdateRateDto } from './dto/update-rate.dto'
import { Rate } from './entities/rate.entity'

@Injectable()
export class RatesService {
	constructor(
		@InjectRepository(Rate)
		private rateRepository: Repository<Rate>,
	) {}
	async create(createRateDto: CreateRateDto) {
		return await this.rateRepository.save(createRateDto)
	}

	async findAll() {
		return await this.rateRepository.find()
	}

	async findOne(id: number) {
		return await this.rateRepository.findOne(id)
	}

	async update(id: number, updateRateDto: UpdateRateDto) {
		return await this.rateRepository.save({ id, ...updateRateDto })
	}

	async remove(id: number) {
		return await this.rateRepository.delete({ id })
	}
}
