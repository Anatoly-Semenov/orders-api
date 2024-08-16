import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GetOneUserCardDto } from './dto/get-one-user-card.dto'
import { SaveCardDto } from './dto/save-card.dto'
import { UsersCard } from './entities/users-card.entity'

@Injectable()
export class UsersCardsService {
	constructor(
		@InjectRepository(UsersCard)
		private userCardsRepository: Repository<UsersCard>,
	) {}
	async saveCard(userId, saveCardDto: SaveCardDto) {
		return await this.userCardsRepository.save({
			...saveCardDto,
			user: {
				id: userId,
			},
		})
	}

	async findAll() {
		return await this.userCardsRepository.find()
	}

	async findOneById(id: number) {
		return await this.userCardsRepository.findOne(id)
	}

	async findOneByToken(token: string) {
		return await this.userCardsRepository.findOne({ token })
	}

	async delete(id: number) {
		return await this.userCardsRepository.delete({ id })
	}
}
