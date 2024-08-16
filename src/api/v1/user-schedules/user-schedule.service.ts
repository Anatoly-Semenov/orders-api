import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CloneUserScheduleDto } from './dto/clone-user-schedule.dto'
import { CreateManyUserScheduleDto } from './dto/create-many-user-schedule.dto'
import { CreateUserScheduleDto } from './dto/create-user-schedule.dto'
import { DeleteUserScheduleDto } from './dto/delete-user-schedule.dto'
import { EnableUserScheduleDto } from './dto/enable-user-schedule.dto'
import { GetUserScheduleDto } from './dto/get-user-schedule.dto'
import { UpdateUserScheduleDto } from './dto/update-user-schedule.dto'
import { UserSchedules } from './entities/user-schedule.entity'

@Injectable()
export class UserScheduleService {
	save(createUserScheduleDto: CreateUserScheduleDto) {
		throw new Error('Method not implemented.')
	}
	constructor(
		@InjectRepository(UserSchedules)
		private userSchedulesRepository: Repository<UserSchedules>,
	) {}

	async create(createUserScheduleDto: CreateUserScheduleDto): Promise<UserSchedules | Error> {
		try {
			const candidate = {
				...createUserScheduleDto,
				user: {
					id: createUserScheduleDto.userId,
				},
			}
			return await this.userSchedulesRepository.save(candidate)
		} catch (error) {
			throw new Error(error.message)
		}
	}

	async createMany(createManyUserScheduleDto: CreateManyUserScheduleDto): Promise<UserSchedules[]> {
		const candidates = createManyUserScheduleDto.items.map((item) => {
			return {
				...item,
				user: {
					id: item.userId,
				},
			}
		})
		return await this.userSchedulesRepository.save(candidates)
	}

	async get(getUserScheduleDto: GetUserScheduleDto): Promise<UserSchedules[]> {
		return await this.userSchedulesRepository.find({
			where: {
				user: {
					id: getUserScheduleDto.userId,
				},
			},
			skip: getUserScheduleDto.offset,
			take: getUserScheduleDto.limit,
		})
	}

	async update(updateUserScheduleDto: UpdateUserScheduleDto): Promise<UserSchedules | Error> {
		const schedule = await this.userSchedulesRepository.findOne(updateUserScheduleDto.id)
		if (!schedule) {
			throw new Error('schedule not found')
		}
		return await this.userSchedulesRepository.save({
			...updateUserScheduleDto,
			user: {
				id: updateUserScheduleDto.id,
			},
		})
	}

	async enable(enableUserScheduleDto: EnableUserScheduleDto): Promise<UserSchedules> {
		try {
			return await this.userSchedulesRepository.save(enableUserScheduleDto)
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}

	async delete(deleteUserScheduleDto: DeleteUserScheduleDto): Promise<number> {
		const schedule = await this.userSchedulesRepository.delete({
			id: deleteUserScheduleDto.id,
		})

		return schedule.affected
	}

	async clone(cloneUserScheduleDto: CloneUserScheduleDto): Promise<UserSchedules | Error> {
		const candidate = await this.userSchedulesRepository.findOne(cloneUserScheduleDto.id)
		delete candidate.id
		if (candidate) {
			return this.userSchedulesRepository.save(candidate)
		}

		throw new Error('Schedule not found')
	}
}
