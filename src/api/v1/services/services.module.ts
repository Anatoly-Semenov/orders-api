import { Module } from '@nestjs/common'
import { ServicesService } from './services.service'
import { ServicesController } from './services.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Services } from './entities/services.entity'
import { ServicesTarget } from './entities/service-target.entity'
import { AdditionalEnableServices } from './entities/additional-enable-services.entity'
import { AdditionalService } from './entities/additional-service.entity'
import { Files } from '../files/entity/files.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Services,
			ServicesTarget,
			AdditionalEnableServices,
			AdditionalService,
			Files,
		]),
	],
	controllers: [ServicesController],
	providers: [ServicesService],
	exports: [ServicesModule, ServicesService],
})
export class ServicesModule {}
