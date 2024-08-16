import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super({
			clientID: '1016406391640-cme2eqq2a2r1gdbgd5mv894t8iia0j17.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: `${process.env.BACKEND_URL_PRODUCTION}/v1/auth/google/get-token`,
			scope: ['email', 'profile'],
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { name, emails } = profile
		done(null, { name, emails })
	}
}
