import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common'
import { RecurrentsService } from './recurrents.service'

import { ThrowError } from 'src/decorators/ThrowError.decorator'

@Controller('recurrents')
export class RecurrentsController {
	constructor(private readonly recurrentsService: RecurrentsService) {}

	@Get()
	@ThrowError('recurrents', 'findAll')
	findAll() {
		return this.recurrentsService.findAll()
	}

	@Get(':id')
	@ThrowError('recurrents', 'findOne')
	findOne(@Param('id') id: string) {
		return this.recurrentsService.findOne(+id)
	}
}
