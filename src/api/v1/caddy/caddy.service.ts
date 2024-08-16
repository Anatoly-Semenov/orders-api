import { HttpService } from '@nestjs/axios'
import { Injectable, InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class CaddyService {
	constructor(private httpService: HttpService) {}
	async addSublcienthost(host: number) {
		try {
			let axiosResponse = this.httpService.put(
				`${process.env.FRONTEND_SUBCLIENT_URL}/config/apps/http/servers/srv0/routes/0/match/0/host/0`,
				JSON.stringify(`${host}.${process.env.FRONTEND_HOST}`),
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			axiosResponse = (await axiosResponse.toPromise()).data
			return axiosResponse
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}
}
