import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, LessThanOrEqual, Repository } from 'typeorm'
import * as Sentry from '@sentry/node'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { Users } from './entities/users.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { format } from 'date-fns-tz'
import {
	accessCodeEmail,
	createUserEmail,
	forgotPasswordEmail,
} from 'src/utils/notifications/notifications/emails'
import { NotificationsService } from 'src/utils/notifications/notifications.service'
import { CloneUserDto } from './dto/clone-user.dto'
import { CheckUserDto } from './dto/check-user.dto'
import { EnableUserDto } from './dto/enable-user.dto'
import { FilterUsersDto } from './dto/filter-users.dto'
import { userFilterSql } from './sql/user.sql'
import { arrayToObject } from 'src/utils/arrayToObject'
import { cryptrEncode } from 'src/utils/crypt'
import { UsersHashs } from './entities/users-hashs.entity'
import { add } from 'date-fns'
import { Cron } from '@nestjs/schedule'
import { UpdateUserByHashDto } from './dto/update-user-by-hash.dto'
import { UsersCandidate } from './entities/users-candidate.entity'
import { CreateUserByEmailDto } from './dto/create-user-by-email.dto'
import { ConfirmUserByCodeDto } from './dto/confirm-user-by-code.dto'
import { generateAuthCode } from 'src/utils/generateAuthCode'
import { SendCodeToDto } from './dto/send-code.dto'
import { AuthService } from '../auth/auth.service'
import { UserInvite } from './entities/user-invite.entity'
import { CreateUserInviteDto } from './dto/create-user-invite.dto'
import { v4 as uuidv4 } from 'uuid'
import { JwtResponseDto } from '../auth/dto/jwt-response.dto'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,

		@InjectRepository(UsersCandidate)
		private usersCandidateRepository: Repository<UsersCandidate>,

		@InjectRepository(UserInvite)
		private userInviteRepository: Repository<UserInvite>,

		@InjectRepository(UsersHashs)
		private usersHashsRepository: Repository<UsersHashs>,

		private readonly notificationService: NotificationsService,

		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,

		private readonly connection: Connection,
	) {}

	private readonly logger = new Logger(UsersService.name)

	async createUserObject(createUserDto: CreateUserDto) {
		const pwd = await this.generatePwd(createUserDto.userPassword)
		const newUser = {
			...createUserDto,
			userPassword: pwd.final,
			roles: arrayToObject(createUserDto?.roles, 'id', 1),
			photos: arrayToObject(createUserDto?.photos, 'path'),
			addresses: arrayToObject(createUserDto?.addresses, 'id'),
		}
		return {
			pwd,
			newUser,
		}
	}
	async create(createUserDto: CreateUserDto): Promise<Users | Error> {
		// Generate password

		const candidate = await this.usersRepository.findOne({
			userEmail: createUserDto.userEmail,
		})
		if (candidate) {
			throw new BadRequestException('Users already exist')
		}

		const { pwd, newUser } = await this.createUserObject(createUserDto)
		//Create new user
		const createdUser = await this.usersRepository
			.save(newUser)
			.then(async (result) => {
				// send email notification
				const hash = await cryptrEncode(String(result.id))
				const returnUrl = createUserDto.returnUrl?.replace(':id', hash)

				const hashCandidate = {
					user: {
						id: result.id,
					},
					expire: Number(
						format(add(Date.now(), { hours: 48 }), 't', {
							timeZone: 'Europe/Moscow',
						}),
					),
					hash,
				}

				const saveHash = await this.usersHashsRepository.save(hashCandidate)

				if (saveHash) {
					await this.notificationService.sendEmail(
						newUser.userEmail,
						createUserEmail({
							password: pwd.clear,
							returnUrl,
						}),
						{
							subject: 'New account',
						},
					)
					return result
				}

				throw new InternalServerErrorException('Registration failed')
			})
			.catch((error) => {
				Sentry.captureException(error)

				throw new BadRequestException(error)
			})
		return createdUser
	}

	async update(updateUserDto: UpdateUserDto, userId: number): Promise<Users> {
		if (!userId) {
			throw new UnauthorizedException('User unauthorization')
		}

		const user = await this.usersRepository.findOne(userId)

		if (updateUserDto.userPassword) {
			updateUserDto.userPassword = await bcrypt.hash(updateUserDto.userPassword, 13)
		}

		const candidate = {
			...user,
			...updateUserDto,
			id: userId,
			roles: arrayToObject(updateUserDto?.roles, 'id', 1),
			addresses: arrayToObject(updateUserDto?.addresses, 'id'),
		}

		return await this.usersRepository.save(candidate)
	}

	async delete(id: string | number, companyId: string | number): Promise<any> {
		try {
			const response: Users[] = await this.usersRepository.find({
				relations: ['clients'],
				where: {
					id,
				},
			})

			const user: Users | undefined = response?.[0]

			if (!user) {
				return new BadRequestException(`User with id ${id} is undefined`)
			}

			if (companyId !== '' && user.clients.length > 1) {
				const clientIndex: number = user.clients.findIndex(({ id }) => {
					return id === +companyId
				})

				if (clientIndex > -1) {
					user.clients.splice(clientIndex, 1)

					try {
						await this.usersRepository.save(user)

						return `User with id ${id} successful deleted from company with id ${companyId}`
					} catch (error) {
						Sentry.captureException(error)

						return new BadRequestException(
							`User with id ${id} have not relation company with id: ${companyId}`,
						)
					}
				} else {
					return new BadRequestException(
						`User with id ${id} have not relation company with id: ${companyId}`,
					)
				}
			} else {
				await this.usersRepository.delete(id)

				return `User with id ${id} successful deleted`
			}
		} catch (error) {
			Sentry.captureException(error)

			throw new BadRequestException(`Failed to delete user with id ${id}`)
		}
	}

	async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any | Error> {
		const candidate = await this.usersRepository.findOne({
			userEmail: forgotPasswordDto.userEmail,
		})

		if (!candidate) {
			throw new NotFoundException('User not found')
		}
		if (!forgotPasswordDto.returnUrl) {
			throw new InternalServerErrorException('returnUrl required')
		}
		const config = {
			subject: 'Forgot Password',
		}

		const hash = await cryptrEncode(String(candidate.id))
		const link = forgotPasswordDto.returnUrl.replace(':id', hash)
		const childs = forgotPasswordEmail(link)

		await this.usersHashsRepository.delete({
			user: {
				id: candidate.id,
			},
		})

		const saveHash = await this.usersHashsRepository.save({
			user: {
				id: candidate.id,
			},
			expire: Number(
				format(add(Date.now(), { hours: 48 }), 't', {
					timeZone: 'Europe/Moscow',
				}),
			),
			hash,
		})

		if (saveHash) {
			const email = await this.notificationService.sendEmail(
				forgotPasswordDto.userEmail,
				childs,
				config,
			)
			return email == 'ok' ? { status: 200 } : false
		}
		return false
	}
	async getMe(userId): Promise<Users> {
		if (!userId) throw new UnauthorizedException()

		try {
			return await this.usersRepository.findOne(userId)
		} catch (error) {
			Sentry.captureException(error)

			throw new UnauthorizedException()
		}
	}

	async findOne(payload: any): Promise<Users> {
		try {
			return await this.usersRepository.findOne(payload)
		} catch (error) {
			Sentry.captureException(error)

			throw new BadRequestException(`Failed to find user with filters: ${payload.toString()}`)
		}
	}

	async findOneById(userId: number): Promise<Users> {
		try {
			return await this.usersRepository.findOne(userId)
		} catch (error) {
			Sentry.captureException(error)

			throw new BadRequestException(`Failed to find user with id ${userId}`)
		}
	}

	async findOneByEmail(userEmail: string): Promise<Users> {
		try {
			return await this.usersRepository.findOne({
				userEmail: userEmail,
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new BadRequestException(`Failed to find user with email ${userEmail}`)
		}
	}

	async updateByHash(updateUserDto: UpdateUserByHashDto, hash: string): Promise<Users> {
		const candidate = await this.usersHashsRepository.findOne({
			hash,
		})

		if (!candidate) throw new NotFoundException('User not found')

		const deleted = this.usersHashsRepository.delete(candidate.id)
		const updated = this.update({ ...updateUserDto, userId: candidate.user.id }, candidate.user.id)
		return Promise.all([deleted, updated]).then((result) => {
			delete result[1].userPassword
			return result[1]
		})
	}

	async clone(cloneUserDto: CloneUserDto): Promise<Users | Error | any> {
		if (!cloneUserDto.userEmail) {
			return new InternalServerErrorException('Email required')
		}
		const candidate = this.usersRepository.findOne(cloneUserDto.userId)
		const checkEmail = this.usersRepository.findOne({
			userEmail: cloneUserDto.userEmail,
		})
		const pwd = this.generatePwd(cloneUserDto.userPassword)
		const [candidatePromise, checkEmailPromise, pwdPromise] = await Promise.all([
			candidate,
			checkEmail,
			pwd,
		])
		if (!candidatePromise) {
			return new NotFoundException('User not found')
		}

		if (candidatePromise.userEmail == cloneUserDto.userEmail || checkEmailPromise) {
			return new BadRequestException('Email has exist')
		}

		delete candidatePromise.id
		return await this.usersRepository.save({
			...candidate,
			...cloneUserDto,
			roles: arrayToObject(cloneUserDto?.roles, 'id', 1),
			photos: arrayToObject(cloneUserDto?.photos, 'path'),
			addresses: arrayToObject(cloneUserDto?.addresses, 'id'),
			userPassword: pwdPromise.final,
		})
	}

	async enable(enableUserDto: EnableUserDto): Promise<Users | Error> {
		try {
			return await this.usersRepository.save(enableUserDto)
		} catch (error) {
			Sentry.captureException(error)

			throw new NotFoundException(error)
		}
	}

	async filter(f: FilterUsersDto): Promise<any> {
		const queryString = userFilterSql(f)

		const dbResult: any[] = await this.connection.query(queryString)
		const roles = []
		dbResult[0]?.roles?.filter(function (item) {
			const i = roles.findIndex((x) => x.id == item.id)
			if (i <= -1) {
				roles.push(item)
			}
			return null
		})
		if (dbResult[0]) {
			dbResult[0].roles = roles
			delete dbResult[0].userPassword
		}

		return dbResult[0] || {}
	}

	async createByEmail(createUserByEmailDto: CreateUserByEmailDto) {
		const requestUser = this.usersRepository.findOne({
			where: {
				userEmail: createUserByEmailDto.userEmail,
			},
		})
		const requestUserCandidate = this.usersCandidateRepository.findOne({
			where: {
				email: createUserByEmailDto.userEmail,
			},
		})

		const [candidate, userCandidate] = await Promise.all([requestUser, requestUserCandidate])
		if (candidate) throw new InternalServerErrorException('Email number already exist')

		const code = generateAuthCode()
		const id = userCandidate ? { id: userCandidate.id } : {}
		const date = new Date()

		const pwd = await this.generatePwd(createUserByEmailDto.userPassword)

		const newUserCandidate = await this.usersCandidateRepository.save({
			...id,
			email: createUserByEmailDto.userEmail,
			phone: createUserByEmailDto.phone,
			phoneIso: createUserByEmailDto.phoneIso,
			meta: createUserByEmailDto.meta,
			password: pwd.final,
			code,
			expire: add(new Date(), { days: 1 }),
		})

		const returnUrl = createUserByEmailDto.returnUrl + '?candidateCode=' + code

		// отправить код
		if (newUserCandidate) {
			const message = await this.notificationService.sendEmail(
				createUserByEmailDto.userEmail,
				accessCodeEmail({
					code,
					returnUrl,
				}),
				{
					subject: 'Код подтверждения',
				},
			)
			return true
		}
		return false
	}

	async confirmUserWithCode(confirmUserByCodeDto: ConfirmUserByCodeDto) {
		const requestUser = this.usersRepository.findOne({
			where: [
				{
					phone: confirmUserByCodeDto.phone,
				},
				{
					userEmail: confirmUserByCodeDto.userEmail,
				},
			],
		})
		const requestUserCandidate = this.usersCandidateRepository.findOne({
			where: [
				{
					phone: confirmUserByCodeDto.phone,
					code: confirmUserByCodeDto.code,
				},
				{
					email: confirmUserByCodeDto.userEmail,
					code: confirmUserByCodeDto.code,
				},
			],
		})

		const [candidate, userCandidate] = await Promise.all([requestUser, requestUserCandidate])
		if (candidate) throw new InternalServerErrorException('Phone/email number already exist')
		if (!userCandidate) throw new InternalServerErrorException('Code incorect')

		const newUser = await this.usersRepository.save({
			phone: confirmUserByCodeDto.phone || userCandidate.phone,
			phoneIso: userCandidate.phoneIso,
			meta: userCandidate.meta,
			userEmail: confirmUserByCodeDto.userEmail,
			userPassword: userCandidate.password,
			roles: arrayToObject(confirmUserByCodeDto?.roles, 'id', 1),
		})
		const finaleUser = await this.usersRepository.findOne(newUser.id)
		const token: JwtResponseDto = await this.authService.generateToken(finaleUser)
		this.usersCandidateRepository.delete(userCandidate.id)
		return { ...newUser, ...token }
	}

	async sendCode(sendCodeToDto: SendCodeToDto) {
		if (!sendCodeToDto.userEmail) throw new InternalServerErrorException('Email required')

		const userRequset = this.usersRepository.findOne({
			where: [{ userEmail: sendCodeToDto.userEmail }, { phone: sendCodeToDto.phone }],
		})

		const userCandidateRequset = this.usersCandidateRepository.findOne({
			where: [{ email: sendCodeToDto.userEmail }, { phone: sendCodeToDto.phone }],
		})

		const [userCandidate] = await Promise.all([userRequset, userCandidateRequset])

		const code = generateAuthCode()
		const id = userCandidate ? { id: userCandidate.id } : {}
		this.usersCandidateRepository.save({
			...id,
			email: sendCodeToDto.userEmail,
			phone: sendCodeToDto.phone,
			code,
		})

		if (sendCodeToDto.userEmail) {
			this.notificationService.sendEmail(
				sendCodeToDto.userEmail,
				accessCodeEmail({
					code,
				}),
				{
					subject: 'Код подтверждения',
				},
			)
		}
		// Либо на телефон
		return true
	}

	async generatePwd(pwd): Promise<any> {
		const password = pwd ? pwd : Math.random().toString(36).substring(7)
		return {
			final: await bcrypt.hash(password, 13),
			clear: password,
		}
	}

	async checkUser(checkUserDto: CheckUserDto): Promise<Users | Error> {
		return checkUserDto.id
			? await this.usersRepository.findOne(checkUserDto.id)
			: await this.usersRepository.findOne({
					userEmail: checkUserDto.userEmail,
			  })
	}

	async createUserInvite(dto: CreateUserInviteDto) {
		try {
			return await this.userInviteRepository.manager.transaction(async (manager) => {
				const userCheck = await this.usersRepository.findOne({
					where: {
						userEmail: dto.email,
					},
				})
				if (userCheck) {
					throw new InternalServerErrorException(
						'user already exist, try to signin or reset password',
					)
				}

				const inviteCandidate = this.userInviteRepository.create({
					...dto,
					clients: [dto.client],
					hash: uuidv4(),
				})
				const result = await manager.save(inviteCandidate)

				if (result.hash) {
					const returnUrl = dto.returnUrl.replace(':id', result.hash)
					this.notificationService.sendEmailHtml({
						name: 'Business',
						to: result.email,
						html: `<h1>Вас пригласили в Business</h1><br/><p>Для продолжения регистрации перейдите по ссылке - <a href="${returnUrl}">${returnUrl}</a></p>`,
						subject: 'Вам пришло приглашение от Business',
					})
				}
				return result
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async getInvitedUserByHash(hash: string) {
		try {
			return this.userInviteRepository.findOne({ where: { hash } })
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async createUserAfterInviteByEmail(hash: string, dto: CreateUserByEmailDto) {
		try {
			return await this.userInviteRepository.manager.transaction(async (manager) => {
				const candidate = await this.userInviteRepository.findOne({
					where: { hash },
				})
				const createUserPromise = this.createByEmail({
					...dto,
					userEmail: candidate.email,
					roles: candidate.roles.map((r) => r.id),
					clients: candidate.clients,
				})

				const removePromise = manager.remove(candidate)
				const [result, remove] = await Promise.all([createUserPromise, removePromise])
				return result
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async createUserAfterInvite(hash: string, dto: CreateUserDto) {
		try {
			return await this.userInviteRepository.manager.transaction(async (manager) => {
				const candidate = await this.userInviteRepository.findOne({
					where: { hash },
				})
				const createUserPromise: any = this.create({
					...dto,
					userEmail: candidate.email,
					roles: candidate.roles.map((r) => r.id),
					clients: candidate.clients,
				})
				const removePromise = manager.remove(candidate)
				const [result] = await Promise.all([createUserPromise, removePromise])
				return result
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new InternalServerErrorException(error)
		}
	}

	async findCandidateByCode(code: string): Promise<UsersCandidate> {
		try {
			return await this.usersCandidateRepository.findOne({
				code: code,
			})
		} catch (error) {
			Sentry.captureException(error)

			throw new BadRequestException(`Failed to find candidate with code: ${code}`)
		}
	}

	@Cron('* * * */30 * *')
	async clearOldUserHash() {
		await this.usersHashsRepository.delete({
			expire: LessThanOrEqual(Number(Date.now())),
		})
		this.logger.log('Old users hash deleted')
		return 'ok'
	}
}
