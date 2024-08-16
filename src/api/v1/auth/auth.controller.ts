/* eslint-disable @typescript-eslint/no-empty-function */
import {
	Controller,
	Post,
	Body,
	HttpCode,
	HttpStatus,
	Get,
	Req,
	UseGuards,
	Res,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthUsersDto } from './dto/auth-users.dto'
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ThrowError } from 'src/decorators/ThrowError.decorator'
import { AuthGuard } from '@nestjs/passport'
import { JwtResponseDto } from './dto/jwt-response.dto'
import { AuthByCodeDto } from './dto/auth-by-code.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({
		operationId: 'token',
		summary: 'Авторизация через логин и пароль',
		description: 'Авторизовывает ранее созданного пользователя',
	})
	@ApiResponse({
		type: JwtResponseDto,
		status: 200,
	})
	@ApiResponse({
		status: 401,
		description: 'Если пользователь не найден или пароль не верный ',
	})
	@ApiBody({
		type: AuthUsersDto,
		required: true,
	})
	@Post('/token')
	@ThrowError('auth', 'login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() authUsersDto: AuthUsersDto) {
		return this.authService.login(authUsersDto)
	}

	@ApiResponse({
		type: JwtResponseDto,
		status: 200,
	})
	@ApiBody({
		type: RefreshTokenDto,
		required: true,
	})
	@Post('/refresh')
	@ThrowError('auth', 'login')
	@HttpCode(HttpStatus.OK)
	async refresh(@Body() body: RefreshTokenDto) {
		return this.authService.refreshToken(body)
	}

	@ApiOperation({
		operationId: 'by-code',
		summary: 'Авторизация через код',
		description: 'Авторизовывает пользователя по одноразовому коду',
	})
	@ApiResponse({
		type: JwtResponseDto,
		status: 200,
		description: 'Вернет accessToken',
	})
	@ApiResponse({
		status: 401,
		description: 'Если пользователь не найден или пароль не верный ',
	})
	@ApiBody({
		type: AuthUsersDto,
		required: true,
	})
	@Post('/by-code')
	@ThrowError('auth', 'by-code')
	@HttpCode(HttpStatus.OK)
	async beCode(@Body() authByCodeDto: AuthByCodeDto) {
		return this.authService.beCode(authByCodeDto)
	}

	@ApiOperation({
		operationId: 'auth-google',
		summary: 'Авторизация через google',
		description:
			'Запращивает данные о пользователе в google. Далее редиректит на фронт url с гет параметром token',
	})
	@ApiResponse({
		type: JwtResponseDto,
		status: 200,
		description: 'Вернет accessToken',
	})
	@Get('/google')
	@UseGuards(AuthGuard('google'))
	googleAuth(@Req() req): void {}

	@ApiOperation({
		operationId: 'auth-yandex',
		summary: 'Авторизация через Yandex',
		description:
			'Запращивает данные о пользователе в yandex. Далее редиректит на фронт url с гет параметром token',
	})
	@ApiResponse({
		type: JwtResponseDto,
		status: 200,
		description: 'Вернет accessToken',
	})
	@Get('/yandex')
	@UseGuards(AuthGuard('yandex'))
	yandexAuth(@Req() req): void {}

	@ApiOperation({
		operationId: 'auth-facebook',
		summary: 'Авторизация через facebook',
		description:
			'Запращивает данные о пользователе в facebook. Далее редиректит на фронт url с гет параметром token',
	})
	@Get('/facebook')
	@UseGuards(AuthGuard('facebook'))
	facebookAuth(@Req() req): void {}

	@ApiExcludeEndpoint()
	@ApiOperation({
		operationId: 'auth-vk',
		summary: 'Авторизация через vk',
		description:
			'Запращивает данные о пользователе в vk. Далее редиректит на фронт url с гет праметрами',
	})
	@Get('/vk')
	@UseGuards(AuthGuard('vkontakte'))
	vkAuth(@Req() req): void {}

	@Get('/google/get-token')
	@UseGuards(AuthGuard('google'))
	async OAuth2GetPayloadGoogle(@Req() req, @Res() res) {
		const { accessToken } = await this.authService.OAuth20Login(req)
		res.redirect(`${process.env.FRONTEND_URL}/account/login/oauth/?token=${accessToken}`)
	}

	@Get('/yandex/get-token')
	@UseGuards(AuthGuard('yandex'))
	async OAuth2GetPayloadYandex(@Req() req, @Res() res) {
		const { accessToken } = await this.authService.OAuth20Login(req)
		res.redirect(`${process.env.FRONTEND_URL}/account/login/oauth/?token=${accessToken}`)
	}

	@Get('/facebook/get-token')
	@UseGuards(AuthGuard('facebook'))
	async OAuth2GetPayloadFacebook(@Req() req, @Res() res) {
		const { accessToken } = await this.authService.OAuth20Login(req)
		res.redirect(`${process.env.FRONTEND_URL}/account/login/oauth/?token=${accessToken}`)
	}
}
