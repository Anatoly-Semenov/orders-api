import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'
import { RatesService } from './rates.service'
import { CreateRateDto } from './dto/create-rate.dto'
import { UpdateRateDto } from './dto/update-rate.dto'
import { ThrowError } from 'src/decorators/ThrowError.decorator'

@Controller('rates')
export class RatesController {
	constructor(private readonly ratesService: RatesService) {}

	@Post()
	@ThrowError('rates', 'create')
	create(@Body() createRateDto: CreateRateDto) {
		return this.ratesService.create(createRateDto)
	}

	@Get()
	@ThrowError('rates', 'findAll')
	findAll() {
		return this.ratesService.findAll()
	}

	@Get(':id')
	@ThrowError('rates', 'findOne')
	findOne(@Param('id') id: string) {
		return this.ratesService.findOne(+id)
	}

	@Put(':id')
	@ThrowError('rates', 'update')
	update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
		return this.ratesService.update(+id, updateRateDto)
	}

	@Delete(':id')
	@ThrowError('rates', 'remove')
	remove(@Param('id') id: string) {
		return this.ratesService.remove(+id)
	}
}
