import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common'
import { CloneUserDto } from './dto/clone-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Users } from './entities/users.entity'
import { UsersService } from './users.service'
import {
	ApiBearerAuth,
	ApiBody,
	ApiExcludeEndpoint,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Role } from './enums/user-roles.enum'
import { Auth } from '../auth/decorators/auth.decorator'
import { EnableUserDto } from './dto/enable-user.dto'
import { FilterUsersDto } from './dto/filter-users.dto'

import { ThrowError } from 'src/decorators/ThrowError.decorator'
import { User } from './decorators/users.decorator'
import { UpdateUserByHashDto } from './dto/update-user-by-hash.dto'
import { CreateUserByEmailDto } from './dto/create-user-by-email.dto'
import { ConfirmUserByCodeDto } from './dto/confirm-user-by-code.dto'
import { SendCodeToDto } from './dto/send-code.dto'
import { CreateUserInviteDto } from './dto/create-user-invite.dto'
import { DeleteUserBodyDto } from './dto/delete-user-body.dto'

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({
		operationId: 'add-user',
		summary: 'Добавление/регистрация пользователя',
		description: 'Создает нового пользователя в базе данных',
	})
	@ApiResponse({
		type: CreateUserDto,
		status: 201,
		description: 'Вернет созданный объект пользователя',
	})
	@ApiResponse({
		status: 400,
		description: 'Вернет 400 если пользователь уже существует',
	})
	@ApiBody({
		type: CreateUserDto,
		required: true,
	})
	@Post('/add')
	@HttpCode(HttpStatus.CREATED)
	@ThrowError('Users', 'create')
	async create(@Body() createUserByEmailDto: CreateUserByEmailDto): Promise<any> {
		return await this.usersService.createByEmail(createUserByEmailDto)
	}

	@ApiOperation({
		operationId: 'add-user-by-only-email',
		summary: 'Добавление/регистрация пользователя по email + code',
		description:
			'Создает кандидата на регистрацию, отрпвляя код с подтверждением на почту пользователя',
	})
	@ApiResponse({
		type: Boolean,
		status: 201,
		description: 'Вернет созданный true если отправлено - false если нет',
	})
	@ApiResponse({
		status: 400,
		description: 'Вернет 400 если пользователь уже существует',
	})
	@ApiBody({
		type: CreateUserByEmailDto,
		required: true,
	})
	@Post('/add-by-only-email')
	@HttpCode(HttpStatus.CREATED)
	@ThrowError('Users', 'create')
	async createByEmail(@Body() createUserByEmailDto: CreateUserByEmailDto): Promise<any> {
		return await this.usersService.createByEmail(createUserByEmailDto)
	}

	@ApiOperation({
		operationId: 'confirm-by-code',
		summary: 'Подтверждение регистрации пользователя по коду',
		description: 'Проверяет верность кода пользователя и регистрирует его',
	})
	@ApiResponse({
		type: CreateUserDto,
		status: 201,
		description: 'Вернет созданный объект пользователя',
	})
	@ApiResponse({
		status: 400,
		description: 'Вернет 400 если пользователь уже существует',
	})
	@ApiBody({
		type: ConfirmUserByCodeDto,
		required: true,
	})
	@Post('/confirm-by-code')
	@HttpCode(HttpStatus.CREATED)
	@ThrowError('Users', 'create')
	async confirmUserWithCode(@Body() confirmUserByCodeDto: ConfirmUserByCodeDto): Promise<any> {
		return await this.usersService.confirmUserWithCode(confirmUserByCodeDto)
	}

	@ApiOperation({
		operationId: 'send-code',
		summary: 'Отправить код подтверждения на почту или телефон',
		description: 'Отправляет уникальный код подтверждения на почту пользователю',
	})
	@ApiResponse({
		type: Boolean,
		status: 200,
		description: 'Вернет true если сообщение отправлено',
	})
	@ApiResponse({
		status: 400,
		description: 'Вернет 400 если пользователь уже существует',
	})
	@ApiBody({
		type: SendCodeToDto,
		required: true,
	})
	@Post('/send-code')
	@HttpCode(HttpStatus.OK)
	@ThrowError('Users', 'create')
	async sendCodeToEmail(@Body() sendCodeToDto: SendCodeToDto): Promise<any> {
		return await this.usersService.sendCode(sendCodeToDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'update-user',
		summary: 'Обновление данных пользователя',
		description: 'Обновить данные пользователя в базе данных',
	})
	@ApiResponse({
		type: UpdateUserDto,
		status: 201,
		description: 'Вернет обновленный объект пользователя',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiBody({
		type: UpdateUserDto,
		required: true,
	})
	@Auth([
		Role.CLIENTACCOUNTANT,
		Role.CLIENTADMIN,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.SUBCLIENT,
	])
	@Put('/update')
	@ThrowError('Users', 'update')
	async update(@Body() updateUserDto: UpdateUserDto, @User() user: any): Promise<Users | Error> {
		return await this.usersService.update(updateUserDto, user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-user',
		summary: 'Удаление пользователя',
		description:
			'Удалить авторизованного пользователя и связанные с ним данные из базе данных. Если указать { companyId } в body, то система удалит его из определенной компании. Если пользователь привязан только к одной компании, при вызове эндопинта, пользователь полностю удалиться из системы!',
	})
	@ApiBody({
		type: DeleteUserBodyDto,
		required: false,
	})
	@ApiResponse({
		status: 200,
		description: 'Пользователь успешно удален (Из системы / Из компании)',
	})
	@Auth([
		Role.CLIENTACCOUNTANT,
		Role.CLIENTADMIN,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.SUBCLIENT,
	])
	@Delete('/:id')
	@ThrowError('Users', 'delete')
	delete(@Param('id') id: string, @Body() body: DeleteUserBodyDto): Promise<number> {
		return this.usersService.delete(id, body?.companyId || '')
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'clone-user',
		summary: 'Клонирование пользователя по id',
		description: 'Вернет обновленный объект пользователя',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект нового пользователя',
		type: CloneUserDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Вернет 400 если userEmail не уникален',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если пользователь не найден',
	})
	@ApiResponse({
		status: 500,
		description: 'Вернет 500 если userEmail отсутсвует',
	})
	@ApiBody({
		type: CloneUserDto,
		required: true,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/clone')
	@ThrowError('Users', 'clone')
	clone(@Body() cloneUserDto: CloneUserDto): Promise<any> {
		return this.usersService.clone(cloneUserDto)
	}

	@ApiOperation({
		operationId: 'forgot-password',
		summary: 'Восставноелние пароля пользователя по email',
		description: 'На указанный email будет выслано письмо с ссылок на восставноление пароля',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет - ок - если ошибок нет',
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если пользователь не найден',
	})
	@ApiBody({
		type: ForgotPasswordDto,
		required: true,
	})
	@HttpCode(200)
	@Post('/forgot-password')
	@ThrowError('Users', 'forgotPassword')
	async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any | Error> {
		return await this.usersService.forgotPassword(forgotPasswordDto)
	}

	@ApiOperation({
		operationId: 'enable-user',
		summary: 'Вкл/выкл пользователя по id',
		description: 'Вернет обновленный объект пользователя',
	})
	@ApiResponse({
		status: 201,
		description: 'Вернет объект пользователя',
		type: EnableUserDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если пользователь не найдет',
	})
	@ApiBody({
		type: EnableUserDto,
		required: true,
	})
	@Post('/enable')
	@ThrowError('Users', 'enable')
	async enable(@Body() enableUserDto: EnableUserDto): Promise<Users | Error> {
		return await this.usersService.enable(enableUserDto)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'get-auth-user',
		summary: 'Получить данные об авторизованном пользователе',
		description: 'Вернет пользователя по токену авторизации',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект пользователя',
		type: CreateUserDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@Auth([
		Role.CLIENTACCOUNTANT,
		Role.CLIENTADMIN,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
		Role.SUBCLIENT,
	])
	@Get('/auth')
	async getAll(@User() user): Promise<Users> {
		return await this.usersService.getMe(user.id)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'find-one-user',
		summary: 'Получение пользователя по email',
		description: 'Вернет пользователя по email. Не доступно для SUBCLIENT',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект пользователя',
		type: CreateUserDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@Auth([
		Role.CLIENTACCOUNTANT,
		Role.CLIENTADMIN,
		Role.CLIENTEMPLOYEE,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Get('/find-one')
	async findOneByEmail(@Query('userEmail') userEmail: string): Promise<Users> {
		return await this.usersService.findOneByEmail(userEmail)
	}

	@ApiOperation({
		operationId: 'update-one-user-by-hash',
		summary: 'Вернет пользователя обновленного пользователя',
		description: 'Вернет объект обновленного пользователя похэшу',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект пользователя',
		type: CreateUserDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если пользователь не найден',
	})
	@Put('/update-by-hash')
	async updateByHash(
		@Body() updateUserDto: UpdateUserByHashDto,
		@Query('hash') hash: string,
	): Promise<Users> {
		return await this.usersService.updateByHash(updateUserDto, hash)
	}

	@ApiExcludeEndpoint()
	@Get('/filter')
	@ThrowError('Users', 'filter')
	async filter(@Query() filterUsersDto: FilterUsersDto): Promise<any> {
		return await this.usersService.filter(filterUsersDto)
	}

	@ApiOperation({
		operationId: 'create-user-invite',
		summary: 'Приглашение пользователя в систему',
		description: 'Приглашение пользователя в систему',
	})
	@ApiResponse({
		type: CreateUserInviteDto,
		status: 201,
		description: 'Вернет созданный объект пользователя',
	})
	@ApiBody({
		type: CreateUserInviteDto,
		required: true,
	})
	@Post('/invite')
	@HttpCode(HttpStatus.CREATED)
	@ThrowError('Users', 'invite')
	async createUserInvite(@Body() dto: CreateUserInviteDto): Promise<any> {
		return await this.usersService.createUserInvite(dto)
	}

	@ApiOperation({
		operationId: 'get-user-invite',
		summary: 'Получить данные приглашенного пользовтаеля',
		description:
			'Вернет данные из приглашения - данные о компании, роли и email пользователя, эти данные нужно передать в метод создания пользователя - createUserAfterInvite / createUserAfterInviteByEmail',
	})
	@ApiParam({
		name: 'hash',
	})
	@Get('/invite/:hash')
	@ThrowError('Users', 'get-invite')
	async getUserInvite(@Param('hash') hash: string): Promise<any> {
		return await this.usersService.getInvitedUserByHash(hash)
	}

	@ApiOperation({
		operationId: 'create-user-after-invite-by-email',
		summary: 'Создает пользователя в системе по email с учетом приглашения',
		description: 'Создает пользователя в системе с учетом приглашения',
	})
	@ApiResponse({
		type: CreateUserByEmailDto,
		status: 201,
		description: 'Вернет созданный объект пользователя',
	})
	@ApiBody({
		type: CreateUserByEmailDto,
		required: true,
	})
	@ApiParam({
		name: 'hash',
	})
	@Post('/create-after-invite-by-email/:hash')
	@HttpCode(HttpStatus.CREATED)
	@ThrowError('Users', 'create-after-invite')
	async createUserAfterInviteByEmail(
		@Param('hash') hash: string,
		@Body() dto: CreateUserByEmailDto,
	): Promise<any> {
		return await this.usersService.createUserAfterInviteByEmail(hash, dto)
	}

	@ApiOperation({
		operationId: 'create-user-after-invite',
		summary: 'Создает пользователя в системе с учетом приглашения',
		description: 'Создает пользователя в системе с учетом приглашения',
	})
	@ApiResponse({
		type: CreateUserDto,
		status: 201,
		description: 'Вернет созданный объект пользователя',
	})
	@ApiBody({
		type: CreateUserDto,
		required: true,
	})
	@ApiParam({
		name: 'hash',
	})
	@Post('/create-after-invite/:hash')
	@HttpCode(HttpStatus.CREATED)
	@ThrowError('Users', 'create-after-invite')
	async createUserAfterInvite(
		@Param('hash') hash: string,
		@Body() dto: CreateUserDto,
	): Promise<any> {
		return await this.usersService.createUserAfterInvite(hash, dto)
	}
}
