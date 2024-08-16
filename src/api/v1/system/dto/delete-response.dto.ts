import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class DeleteResponseDto {
	@ApiProperty()
	@IsOptional()
	@Type(() => Number)
	id: number

	@ApiProperty()
	@Type(() => String)
	message: string

	constructor(partial?: Partial<DeleteResponseDto>) {
		if (partial) {
			Object.assign(this, partial)
		}
	}
}
