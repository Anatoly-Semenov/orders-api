import { Module } from '@nestjs/common'
import { AddressesService } from './addresses.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Addresses } from './entities/address.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Addresses])],
	providers: [AddressesService],
	exports: [AddressesModule, AddressesService],
})
export class AddressesModule {}
