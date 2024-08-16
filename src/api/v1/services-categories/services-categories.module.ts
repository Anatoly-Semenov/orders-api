import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilterModule } from 'src/utils/filter/filter.module'
import { ServiceCategories } from './entities/service-categories.entity'
import { ServicesCategoriesController } from './services-categories.controller'
import { ServicesCategoriesService } from './services-categories.service'

@Module({
	imports: [TypeOrmModule.forFeature([ServiceCategories]), FilterModule],
	controllers: [ServicesCategoriesController],
	providers: [ServicesCategoriesService],
})
export class ServicesCategoriesModule {}
