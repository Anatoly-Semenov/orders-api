import { Controller, Get } from '@nestjs/common'
import { ApiDefaultResponse } from '@nestjs/swagger'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiDefaultResponse({ schema: { example: 'ok' } })
	getHello(): string {
		return this.appService.getHello()
	}
}
