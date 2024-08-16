import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Clients } from '../clients/entities/clients.entity'
import { ClientPaymentsSettingsController } from './client-payments-settings.controller'
import { ClientPaymentsSettings } from './entities/clients-payments-settings.entity'
import { ClientPaymentsSettingsService } from './client-payments-settings.service'

@Module({
	imports: [TypeOrmModule.forFeature([ClientPaymentsSettings, Clients])],
	controllers: [ClientPaymentsSettingsController],
	providers: [ClientPaymentsSettingsService],
})
export class ClientPaymentsSettingsModule {}
