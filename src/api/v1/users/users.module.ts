import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'
import { Users } from './entities/users.entity'
import { UsersService } from './users.service'
import { Clients } from '../clients/entities/clients.entity'
import { HttpModule } from '@nestjs/axios'
import { Notifications } from 'src/utils/notifications/entities/notification.entity'
import { NotificationsModule } from 'src/utils/notifications/notifications.module'
import { FilterModule } from 'src/utils/filter/filter.module'
import { UsersHashs } from './entities/users-hashs.entity'
import { UsersCandidate } from './entities/users-candidate.entity'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { UserInvite } from './entities/user-invite.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Users,
			UsersCandidate,
			UsersHashs,
			Clients,
			Notifications,
			UserInvite,
		]),
		HttpModule,
		NotificationsModule,
		FilterModule,
		forwardRef(() => AuthModule),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersModule, UsersService],
})
export class UsersModule {}
