import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString } from 'class-validator'

export class AddTargetDto {
	@IsString()
	@ApiProperty()
	readonly name: string
}
