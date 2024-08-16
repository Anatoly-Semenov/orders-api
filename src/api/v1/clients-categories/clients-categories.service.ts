import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, In, Repository } from 'typeorm'
import { CreateClientsCategoriesTypesDto } from './dto/create-clients-categories-types.dto'
import { CreateClientsCategoriesDto } from './dto/create-clients-categories.dto'
import { DeleteClientsCategoriesDto } from './dto/delete-clients-categories.dto'
import { DeleteOneClientsCategoriesTypesDto } from './dto/delete-one-clients-categories-types.dto'
import { EnableClientsCategoriesTypesDto } from './dto/enable-client-category-types.dto'
import { EnableClientsCategoriesDto } from './dto/enable-client-category.dto'
import {
	FilterClientsCategoriesDto,
	FilterClientsTypesDto,
} from './dto/filter-clientcategories.dto'
import { GetAllClientsCategoriesTypeDto } from './dto/get-all-clients-categories-types.dto'
import { GetOneClientsCategoriesTypeDto } from './dto/get-one-clients-categoires-type.dto'
import { GetOneClientsCategoriesDto } from './dto/get-one-clients-categories.dto'
import { UpdateClientsCategoriesTypesDto } from './dto/update-clients-categoires-types.dto'
import { UpdateClientsCategoriesDto } from './dto/update-clients-categories.dto'
import { ClientsCategoriesTypes } from './entities/clients-categories-types.entity'
import { ClientsCategories } from './entities/clients-categories.entity'
import { clientsCategoriesFilterSql, clientsTypesFilterSql } from './sql/clients-categories.sql'

@Injectable()
export class ClientsCategoriesService {
	constructor(
		@InjectRepository(ClientsCategories)
		private clientsCategoriesRepository: Repository<ClientsCategories>,

		@InjectRepository(ClientsCategoriesTypes)
		private clientsCategoriesTypesRepository: Repository<ClientsCategoriesTypes>,

		private readonly connection: Connection,
	) {}

	async create(
		createClientsCategoriesDto: CreateClientsCategoriesDto,
	): Promise<ClientsCategories | Error> {
		return await this.clientsCategoriesRepository.save(createClientsCategoriesDto)
	}

	async update(
		updateClientsCategoriesDto: UpdateClientsCategoriesDto,
	): Promise<ClientsCategories | Error> {
		return await this.clientsCategoriesRepository.save(updateClientsCategoriesDto)
	}

	async enableCategory(
		enableClientsCategoriesDto: EnableClientsCategoriesDto,
	): Promise<ClientsCategories> {
		try {
			return await this.clientsCategoriesRepository.save(enableClientsCategoriesDto)
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}

	async delete(deleteClientsCategoriesDto: DeleteClientsCategoriesDto): Promise<number> {
		const category = await this.clientsCategoriesRepository.delete({
			id: deleteClientsCategoriesDto.id,
		})
		return category.affected
	}

	async getAllCategories(): Promise<ClientsCategories[]> {
		return await this.clientsCategoriesRepository.find()
	}

	async filterCategpries(f: FilterClientsCategoriesDto): Promise<any> {
		const queryString = clientsCategoriesFilterSql(f)
		const dbResult: any[] = await this.connection.query(queryString)
		return dbResult || []
	}

	async filterTypes(f: FilterClientsTypesDto): Promise<any> {
		const queryString = clientsTypesFilterSql(f)
		const dbResult: any[] = await this.connection.query(queryString)
		return dbResult || []
	}

	async getOneCategory(
		getOneClientsCategoriesDto: GetOneClientsCategoriesDto,
	): Promise<ClientsCategories> {
		return await this.clientsCategoriesRepository.findOne(getOneClientsCategoriesDto.id)
	}

	async getOneCategoryType(
		getClientsCategoriesOneTypeDto: GetOneClientsCategoriesTypeDto,
	): Promise<ClientsCategoriesTypes> {
		return await this.clientsCategoriesTypesRepository.findOne(getClientsCategoriesOneTypeDto.id)
	}

	async getAllCategoryType(
		getAllClientsCategoriesOneTypeDto: GetAllClientsCategoriesTypeDto,
	): Promise<ClientsCategoriesTypes[]> {
		return await this.clientsCategoriesTypesRepository.find({
			select: ['id', 'name', 'description', 'category'],
			where: {
				category: {
					id: getAllClientsCategoriesOneTypeDto.catId,
				},
			},
		})
	}

	async deleteType(
		deleteOneClientsCategoriesTypesDto: DeleteOneClientsCategoriesTypesDto,
	): Promise<number> {
		const category = await this.clientsCategoriesTypesRepository.delete({
			id: deleteOneClientsCategoriesTypesDto.id,
		})
		return category.affected
	}

	async createType(
		createClientsCategoriesTypesDto: CreateClientsCategoriesTypesDto,
	): Promise<ClientsCategoriesTypes | Error> {
		const candidate = {
			...createClientsCategoriesTypesDto,
			category: {
				id: createClientsCategoriesTypesDto.catId,
			},
		}
		return await this.clientsCategoriesTypesRepository.save(candidate)
	}

	async updateType(
		updateClientsCategoriesTypesDto: UpdateClientsCategoriesTypesDto,
	): Promise<ClientsCategoriesTypes | Error> {
		return await this.clientsCategoriesTypesRepository.save(updateClientsCategoriesTypesDto)
	}

	async enableType(
		enableClientsCategoriesTypesDto: EnableClientsCategoriesTypesDto,
	): Promise<ClientsCategoriesTypes> {
		try {
			return await this.clientsCategoriesTypesRepository.save(enableClientsCategoriesTypesDto)
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}
}
