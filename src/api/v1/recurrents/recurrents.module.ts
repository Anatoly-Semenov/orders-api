import { Module } from '@nestjs/common'
import { RecurrentsService } from './recurrents.service'
import { RecurrentsController } from './recurrents.controller'
import { PaymentsModule } from 'src/api/v1/payments/payments.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Recurrent } from './entities/recurrent.entity'
import { PaymentsService } from 'src/api/v1/payments/payments.service'

@Module({
	imports: [TypeOrmModule.forFeature([Recurrent]), PaymentsModule],
	controllers: [RecurrentsController],
	providers: [RecurrentsService],
})
export class RecurrentsModule {}
