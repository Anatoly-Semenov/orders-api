import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private authService: AuthService) {
		super()
	}
	handleRequest(err: any, user: any, info: Error) {
		if (err || !user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
