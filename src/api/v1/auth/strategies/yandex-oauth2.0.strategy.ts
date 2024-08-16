import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-yandex'

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
	constructor() {
		super({
			clientID: 'f197975362044086880949ee50ee4a07',
			clientSecret: '1afbfdcf41044af689537434352ad631',
			callbackURL: `${process.env.BACKEND_URL_PRODUCTION}/v1/auth/yandex/get-token`,
			scope: 'login:email',
			profileFields: ['login:email', 'login:info'],
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: (err: any, user: any, info?: any) => void,
	): Promise<any> {
		const { name, emails } = profile

		done(null, { name, emails })
	}
}
