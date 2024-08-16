import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	UnauthorizedException,
	Logger,
	InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { ManipulateType } from 'dayjs'
import * as dayjs from 'dayjs'
import * as Sentry from '@sentry/node'

import { Repository } from 'typeorm'
import { Tokens } from './tokens.entity'
import { UsersService } from '../users/users.service'
import { REQUEST } from '@nestjs/core'

import { AuthByCodeDto } from './dto/auth-by-code.dto'
import { UserMeta } from '../users/enums/user-meta.emum'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { parsePhoneNumber } from 'libphonenumber-js'
import { EFilesHost, EFilesTags } from '../files/enums/files.enum'
import { Files } from '../files/entity/files.entity'
import { Social } from './enums/social.enums'
import { socialToAvatarPath } from './constants'
import { JwtResponseDto } from './dto/jwt-response.dto'
import { AuthUsersDto } from './dto/auth-users.dto'
import { ConfigService } from '@nestjs/config'
import { AuthConfig } from 'src/config/auth.config'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Injectable()
export class AuthService {
	constructor(
		@Inject(REQUEST) private request,

		@InjectRepository(Tokens)
		private tokensRepository: Repository<Tokens>,

		private jwtService: JwtService,

		private configService: ConfigService,

		@Inject(forwardRef(() => UsersService))
		private usersService: UsersService,

		@InjectRepository(Files)
		private filesRepository: Repository<Files>,
	) {}

	private readonly logger = new Logger(AuthService.name)

	async validateUser(userEmail: string, userPassword: string): Promise<any> {
		const user = await this.usersService.findOneByEmail(userEmail)

		if (user && userPassword == user.userPassword) {
			delete user.userPassword
			return user
		}
		return null
	}

	async login(user: AuthUsersDto): Promise<JwtResponseDto> {
		const candidate = await this.usersService.findOneByEmail(user.userEmail)

		if (!candidate) throw new UnauthorizedException(null, 'user not found')
		if (!user.userPassword) throw new UnauthorizedException(null, 'Password is required')

		const compare = await bcrypt.compare(user.userPassword, candidate.userPassword)

		if (!compare) throw new UnauthorizedException(null, 'Passwords not match')

		return this.generateToken(candidate)
	}

	generateToken(user: any): JwtResponseDto {
		const {
			jwt_secret_key: accessSecret,
			jwt_expire_time: accessExpiresIn,
			jwt_expire_time_value: expireValue,
			jwt_expire_time_type: expireUnit,
			jwt_refresh_secret_key: refreshSecret,
			jwt_refresh_expire_time: refreshExpiresIn,
			jwt_refresh_expire_time_value: expireRefreshValue,
			jwt_refresh_expire_time_type: expireRefreshUnit,
		} = this.configService.get<AuthConfig>('auth')

		delete user.userPassword

		const accessToken: string = this.jwtService.sign(
			{ user },
			{
				secret: accessSecret,
				expiresIn: accessExpiresIn,
			},
		)

		const refreshToken: string = this.jwtService.sign(
			{ user },
			{
				secret: refreshSecret,
				expiresIn: refreshExpiresIn,
			},
		)

		const expireDateAccessToken: string = dayjs()
			.add(+expireValue, expireUnit as ManipulateType)
			.format()
		const expireDateRefreshToken: string = dayjs()
			.add(+expireRefreshValue, expireRefreshUnit as ManipulateType)
			.format()

		return {
			accessToken,
			refreshToken,
			expireDateAccessToken,
			expireDateRefreshToken,
		}
	}

	async refreshToken(body: RefreshTokenDto): Promise<JwtResponseDto> {
		try {
			const decodeToken: any = await this.jwtService.verify(body.refreshToken, {
				secret: this.configService.get<string>('auth.jwt_refresh_secret_key'),
			})

			if (decodeToken.user) {
				return this.generateToken(decodeToken.user)
			}

			throw new UnauthorizedException()
		} catch (error) {
			Sentry.captureException(error)

			throw new UnauthorizedException()
		}
	}

	async beCode(authByCodeDto: AuthByCodeDto): Promise<JwtResponseDto> {
		const code = await this.usersService.findCandidateByCode(authByCodeDto.code)

		if (!code) throw new UnauthorizedException(null, 'code not found')

		const candidate = await this.usersService.findOne({ userEmail: code.email, phone: code.phone })

		return this.generateToken(candidate)
	}

	async OAuth20Login(req, social = Social.Yandex): Promise<JwtResponseDto> {
		if (!req?.user?.emails.length) {
			throw new BadRequestException('No auth emails')
		}
		try {
			const user = await this.usersService.findOneByEmail(req.user.emails[0].value)

			if (!user) {
				await this.usersService.create(this.getUserData(req.user))
				const newUser = await this.usersService.findOneByEmail(req.user.emails[0].value)

				const { default_avatar_id: avatarId } = req.user

				if (avatarId) {
					await this.filesRepository.save({
						fullPath: socialToAvatarPath[Social.Yandex].replace(':avatarId', avatarId),
						mimetype: 'image/png',
						tag: EFilesTags.Photo,
						host: EFilesHost.Server,
						user: {
							id: newUser.id,
						},
					})
				}

				return this.generateToken(newUser)
			}

			return this.generateToken(user)
		} catch (error) {
			this.logger.error(error.stack)

			Sentry.captureException(error)
			throw new InternalServerErrorException(error)
		}
	}

	getUserData(user): CreateUserDto {
		const { first_name: firstName, last_name: lastName, default_phone: defaultPhone } = user
		const result: Mutable<CreateUserDto> = {
			userEmail: user.emails[0].value,
			photos: [],
		}
		const meta: {
			firstName?: UserMeta
			lastName?: string
		} = {
			firstName,
			lastName,
		}

		if (Object.keys(meta).length) {
			result.meta = meta
		}

		if (defaultPhone?.number) {
			result.phone = defaultPhone.number
			result.phoneIso = parsePhoneNumber(defaultPhone.number).country
		}

		return result
	}
}
