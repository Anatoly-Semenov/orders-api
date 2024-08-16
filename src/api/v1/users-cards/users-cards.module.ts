import { Module } from '@nestjs/common'
import { UsersCardsService } from './users-cards.service'
import { UsersCardsController } from './users-cards.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersCard } from './entities/users-card.entity'
import { PaymentsModule } from '../payments/payments.module'

@Module({
	imports: [TypeOrmModule.forFeature([UsersCard])],
	controllers: [UsersCardsController],
	providers: [UsersCardsService],
	exports: [UsersCardsModule, UsersCardsService],
})
export class UsersCardsModule {}
