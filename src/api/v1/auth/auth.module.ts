import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'

import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from '../users/entities/users.entity'
import { Files } from '../files/entity/files.entity'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { JwtStrategy } from './strategies/jwt.strategy'
import { Tokens } from './tokens.entity'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { GoogleStrategy } from './strategies/google-oauth2.0.stategy'
import { UsersModule } from '../users/users.module'
import { FacebookStrategy } from './strategies/facebook-oauth2.0.strategy'
import { VkStrategy } from './strategies/vk-oauth.strategy'
import { UsersCandidate } from '../users/entities/users-candidate.entity'
import { YandexStrategy } from './strategies/yandex-oauth2.0.strategy'

@Module({
	imports: [
		TypeOrmModule.forFeature([Users, UsersCandidate, Tokens, Files]),
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '24h' },
		}),
		forwardRef(() => UsersModule),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		JwtAuthGuard,
		RolesGuard,
		GoogleStrategy,
		FacebookStrategy,
		YandexStrategy,
		VkStrategy,
	],
	exports: [AuthService, JwtModule, AuthModule],
})
export class AuthModule {}
