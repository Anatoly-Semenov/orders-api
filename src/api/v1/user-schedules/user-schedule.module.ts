import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserSchedules } from './entities/user-schedule.entity'
import { UserScheduleController } from './user-schedule.controller'
import { UserScheduleService } from './user-schedule.service'

@Module({
	imports: [TypeOrmModule.forFeature([UserSchedules])],
	controllers: [UserScheduleController],
	providers: [UserScheduleService],
})
export class UserScheduleModule {}
