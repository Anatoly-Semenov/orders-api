import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateServiceCategoryDto } from './dto/create-service-category.dto'
import { DeleteServiceCategoryDto } from './dto/delete-service-category.dto'
import { GetOneServiceCategoryDto } from './dto/get-one-service-category.dto'
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto'
import { ServiceCategories } from './entities/service-categories.entity'
import { ServicesCategoriesService } from './services-categories.service'
import { Role } from '../users/enums/user-roles.enum'
import { Auth } from '../auth/decorators/auth.decorator'
import { FilterServiceCategoryDto } from './dto/filter-service-category.dto'
import { ThrowError } from 'src/decorators/ThrowError.decorator'

@ApiTags('Services categories')
@Controller('services-categories')
export class ServicesCategoriesController {
	constructor(private readonly servicesCategoriesService: ServicesCategoriesService) {}

	@Post('/add')
	@ThrowError('services-categories', 'create')
	async create(
		@Body() createServiceCategoryDto: CreateServiceCategoryDto,
	): Promise<ServiceCategories | Error> {
		return await this.servicesCategoriesService.create(createServiceCategoryDto)
	}

	@Get('/get/:id')
	@ThrowError('services-categories', 'getOne')
	getOne(@Param() getOneServiceCategoryDto: GetOneServiceCategoryDto): Promise<ServiceCategories> {
		return this.servicesCategoriesService.getOne(getOneServiceCategoryDto)
	}

	@Get('/filter')
	@ThrowError('services-categories', 'filter')
	async filter(@Query() f: FilterServiceCategoryDto): Promise<any> {
		return await this.servicesCategoriesService.filter(f)
	}

	@Delete('/delete/:id')
	@ThrowError('services-categories', 'delete')
	delete(@Param() deleteServiceCategoryDto: DeleteServiceCategoryDto): Promise<number> {
		return this.servicesCategoriesService.delete(deleteServiceCategoryDto)
	}

	@Put('/update/')
	@ThrowError('services-categories', 'update')
	async update(
		@Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
	): Promise<ServiceCategories | Error> {
		return await this.servicesCategoriesService.update(updateServiceCategoryDto)
	}
}
