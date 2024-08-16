import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Strategy } from 'passport-vkontakte'

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vkontakte') {
	constructor() {
		super(
			{
				clientID: '8037104',
				clientSecret: 'U5erWboUjhB6ujtR9aHn',
				callbackURL: `${process.env.FRONTEND_URL}/auth-social/`,
				scope: ['status', 'email', 'friends', 'notify'],
			},
			function (req, accessToken, refreshToken, params, profile, done) {
				return done(null, profile)
			},
		)
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: (err: any, user: any, info?: any) => void,
	): Promise<any> {
		done(null, profile)
	}
}
