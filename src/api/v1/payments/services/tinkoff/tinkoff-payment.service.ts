import { HttpService } from '@nestjs/axios'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { catchError, firstValueFrom, Observable } from 'rxjs'
import { CreateMerchantShopInTinkoffDto } from '../../dto/tinkoff/create-merchant-shop-in-tinkoff.dto'
import { InitTinkoffDto } from '../../dto/tinkoff/init-tinkoff.dto'
import * as FormDataNode from 'form-data'
import { ConfigService } from '@nestjs/config'
import { TinkoffConfig } from 'src/config/tinkoff.config'
import { Config } from 'src/config/main.config'
import { CloseTinkoffDto } from '../../dto/tinkoff/close-tinkoff.dto'
import { CloseTinkoffParamsDto } from '../../dto/tinkoff/close-tinkoff-params.dto'

@Injectable()
export class TinkoffPaymentService {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {}

	async init(dto: InitTinkoffDto) {
		try {
			const { url_pay: url } = this.configService.get<TinkoffConfig>(Config.TINKOFF)

			const response: any = await this.httpService.axiosRef.post<any>(`${url}/Init`, dto)

			return response.data
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	async close(data: CloseTinkoffParamsDto): Promise<any> {
		try {
			const { url_pay: url, terminalKey: TerminalKey } = this.configService.get<TinkoffConfig>(
				Config.TINKOFF,
			)

			const body = new CloseTinkoffDto({
				...data,
				TerminalKey,
			})

			const response: any = await this.httpService.axiosRef.post<any>(`${url}/Cancel`, body)

			return response.data
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	async createMerchantShopInTinkoff(dto: CreateMerchantShopInTinkoffDto) {
		const { username, password, terminalRegisterUrl } = this.configService.get<TinkoffConfig>(
			Config.TINKOFF,
		)

		try {
			const formData = new FormDataNode()
			formData.append('grant_type', 'password')
			formData.append('username', username)
			formData.append('password', password)
			const tokenQuery: Observable<any> = this.httpService.post<any>(
				`${terminalRegisterUrl}/oauth/token`,
				formData,
				{
					auth: {
						username: 'partner',
						password: 'partner',
					},
					headers: {
						...formData.getHeaders(),
					},
				},
			)

			const token = await firstValueFrom(
				tokenQuery.pipe(
					catchError((error) => {
						throw error
					}),
				),
			)

			const query: Observable<any> = this.httpService.post<any>(
				`${terminalRegisterUrl}/register`,
				dto,
				{
					headers: {
						Authorization: `Bearer ${token.data.access_token}`,
					},
				},
			)
			const { data } = await firstValueFrom(
				query.pipe(
					catchError((error) => {
						throw error?.response?.data || error
					}),
				),
			)
			return data
		} catch (error) {
			throw error
		}
	}
}
