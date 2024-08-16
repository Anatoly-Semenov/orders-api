import { Test, TestingModule } from '@nestjs/testing'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from '../auth.service'
import { Tokens } from '../tokens.entity'
import { Users } from '../../users/entities/users.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { LocalStrategy } from '../strategies/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '../constants'

describe('AuthService', () => {
	let service: AuthService
	let userDto
	const mockUsersRepository = {
		issueToken: jest.fn((dto) => {
			return { ...dto }
		}),
		validateUser: jest.fn((dto) => {
			return { ...dto }
		}),
		findOne: jest.fn((dto) => userDto),
	}
	const mockUsersTokenRepository = {
		delete: jest.fn((dto) => dto),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				PassportModule,
				JwtModule.register({
					secret: jwtConstants.secret,
					signOptions: { expiresIn: '24h' },
				}),
			],
			providers: [
				AuthService,
				LocalStrategy,
				JwtStrategy,
				JwtAuthGuard,
				{
					provide: getRepositoryToken(Users),
					useValue: mockUsersRepository,
				},
				{
					provide: getRepositoryToken(Tokens),
					useValue: mockUsersTokenRepository,
				},
			],
		}).compile()

		userDto = {
			id: Date.now(),
			userEmail: 'test@service.com',
			userPassword: 'Teaspassword',
			role: {
				id: 1,
				name: 'client',
			},
		}
		service = module.get<AuthService>(AuthService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should be create access token', async () => {
		return service.issueToken(userDto).then((result) => {
			expect(result).toEqual({
				accessToken: expect.any(String),
			})
		})
	})

	it('should be validate user', async () => {
		return service.validateUser(userDto.userEmail, userDto.userPassword).then((result) => {
			expect(result).toEqual({
				...userDto,
			})
		})
	})
})
