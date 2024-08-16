import { BasicStrategy as Strategy } from 'passport-http'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClientsService } from '../../clients/clients.service'

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly clientsService: ClientsService) {
		super({
			passReqToCallback: true,
		})
	}

	public validate = async (req, username, password): Promise<boolean> => {
		const candidate = await this.clientsService.clientValidate({
			username,
			password,
		})

		if (!candidate.error) {
			return true
		}
		throw new UnauthorizedException()
	}
}
