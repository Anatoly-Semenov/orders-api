import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class UpdateTargetDto {
	@IsInt()
	@ApiProperty()
	readonly id: number

	@IsString()
	@IsOptional()
	@ApiProperty()
	readonly name: string
}
