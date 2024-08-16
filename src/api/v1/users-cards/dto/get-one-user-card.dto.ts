import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class GetOneUserCardDto {
	@ApiProperty({
		description: 'Card id',
		required: false,
	})
	@IsOptional()
	@IsInt()
	readonly id?: number

	@ApiProperty({
		description: 'Card token',
		required: false,
	})
	@IsOptional()
	@IsString()
	readonly token?: string
}
