import { IsString } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CloseTinkoffParamsDto } from './close-tinkoff-params.dto'

export class CloseTinkoffDto extends PartialType(CloseTinkoffParamsDto) {
	@IsString()
	@ApiProperty()
	TerminalKey: string

	constructor(partial?: Partial<CloseTinkoffDto>) {
		super()

		if (partial) {
			Object.assign(this, partial)
		}
	}
}
