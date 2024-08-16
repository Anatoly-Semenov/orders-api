import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as Sentry from '@sentry/node'
import { FilterService } from 'src/utils/filter/filter.service'
import { Connection, Repository } from 'typeorm'
import { CreateServiceCategoryDto } from './dto/create-service-category.dto'
import { DeleteServiceCategoryDto } from './dto/delete-service-category.dto'
import { FilterServiceCategoryDto } from './dto/filter-service-category.dto'
import { GetOneServiceCategoryDto } from './dto/get-one-service-category.dto'
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto'
import { ServiceCategories } from './entities/service-categories.entity'
import { serviceCategoryFilterSql } from './sql/service-categories.sql'

@Injectable()
export class ServicesCategoriesService {
	save(createServiceCategoryDto: CreateServiceCategoryDto) {
		throw new Error('Method not implemented.')
	}
	constructor(
		@InjectRepository(ServiceCategories)
		private serviceCategoriesRepository: Repository<ServiceCategories>,

		private readonly filterService: FilterService,
		private readonly connection: Connection,
	) {}

	async create(
		createServiceCategoryDto: CreateServiceCategoryDto,
	): Promise<ServiceCategories | Error> {
		try {
			return await this.serviceCategoriesRepository.save(createServiceCategoryDto)
		} catch (error) {
			Sentry.captureException(error)
			throw new Error(error.message)
		}
	}

	async getOne(getOneServiceCategoryDto: GetOneServiceCategoryDto): Promise<ServiceCategories> {
		try {
			return await this.serviceCategoriesRepository.findOne(getOneServiceCategoryDto.categoryId)
		} catch (error) {
			Sentry.captureException(error)

			throw new BadRequestException(error)
		}
	}

	async filter(f: FilterServiceCategoryDto): Promise<any> {
		const queryString = serviceCategoryFilterSql(f)
		const dbResult: any[] = await this.connection.query(queryString)
		return dbResult[0] || {}
	}

	async update(
		updateServiceCategoryDto: UpdateServiceCategoryDto,
	): Promise<ServiceCategories | Error> {
		const category = await this.serviceCategoriesRepository.findOne(
			updateServiceCategoryDto.categoryId,
		)

		if (!category) {
			Sentry.captureException('schedule not found')
			throw new Error('schedule not found')
		}

		return await this.serviceCategoriesRepository.save(updateServiceCategoryDto)
	}

	async delete(deleteServiceCategoryDto: DeleteServiceCategoryDto): Promise<number> {
		const schedule = await this.serviceCategoriesRepository.delete({
			id: deleteServiceCategoryDto.categoryId,
		})
		return schedule.affected
	}
}
