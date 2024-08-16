import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AddressesModule } from '../addresses/addresses.module'
import { ClientsModule } from '../clients/clients.module'
import { ServicesModule } from '../services/services.module'
import { UsersModule } from '../users/users.module'
import { Files } from './entity/files.entity'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Files]),
		HttpModule,
		UsersModule,
		ClientsModule,
		ServicesModule,
		AddressesModule,
	],
	controllers: [FilesController],
	providers: [FilesService],
})
export class FilesModule {}
