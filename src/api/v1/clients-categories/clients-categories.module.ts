import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsCategoriesController } from './clients-categories.controller'
import { ClientsCategoriesService } from './clients-categories.service'
import { ClientsCategoriesTypes } from './entities/clients-categories-types.entity'
import { ClientsCategories } from './entities/clients-categories.entity'

@Module({
	imports: [TypeOrmModule.forFeature([ClientsCategories, ClientsCategoriesTypes])],
	controllers: [ClientsCategoriesController],
	providers: [ClientsCategoriesService],
	exports: [ClientsCategoriesModule],
})
export class ClientsCategoriesModule {}
