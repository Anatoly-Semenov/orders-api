import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class ServicesDeleteManyDto {
	@IsInt()
	@ApiProperty()
	ids: number[]
}
