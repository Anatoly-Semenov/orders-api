import { Module } from '@nestjs/common'
import { FilterService } from './filter.service'

@Module({
	providers: [FilterService],
	exports: [FilterModule, FilterService],
})
export class FilterModule {}
