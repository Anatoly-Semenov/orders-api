import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class ExtractUserGuard extends AuthGuard('jwt') {
	handleRequest(err: any, user: any) {
		return user
	}
}
