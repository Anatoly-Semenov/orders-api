import { Module } from '@nestjs/common'
import { ServicesPriceSettingsService } from './services-price-settings.service'
import { ServicesPriceSettingsController } from './services-price-settings.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
// import { ServicesPriceSettings } from './entities/services-price-settings.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			// ServicesPriceSettings
		]),
	],
	controllers: [ServicesPriceSettingsController],
	providers: [ServicesPriceSettingsService],
})
export class ServicesPriceSettingsModule {}
