import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-facebook'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
	constructor() {
		super({
			clientID: '663273388027927',
			clientSecret: '26b1e1ef484f41ad61f6dc00248acbed',
			callbackURL: `${process.env.BACKEND_URL_PRODUCTION}/v1/auth/facebook/get-token`,
			scope: 'email',
			profileFields: ['emails', 'name'],
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
