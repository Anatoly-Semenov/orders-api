import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaymentsService } from '../payments/payments.service'
import { Recurrent } from './entities/recurrent.entity'

@Injectable()
export class RecurrentsService {
	constructor(
		@InjectRepository(Recurrent)
		private readonly recurrentRepository: Repository<Recurrent>,
		private readonly paymentService: PaymentsService,
	) {}

	async findAll() {
		return await this.recurrentRepository.find()
	}

	async findOne(recurrentId: number) {
		return await this.recurrentRepository.findOne(recurrentId)
	}
}
