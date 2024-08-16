import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CloseTinkoffParamsDto {
	@IsString()
	@ApiProperty()
	PaymentId: number

	@IsString()
	@ApiProperty()
	@IsOptional()
	Token: string

	constructor(partial?: Partial<CloseTinkoffParamsDto>) {
		if (partial) {
			Object.assign(this, partial)
		}
	}
}
