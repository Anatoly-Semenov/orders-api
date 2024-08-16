import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional } from 'class-validator'

export class GetOneClientsDto {
	@IsInt()
	@ApiProperty({
		description: 'App id',
	})
	appId: number

	@IsInt()
	@ApiProperty({ default: 0 })
	@IsOptional()
	readonly excludeServices?: number = 1 | 0
}
