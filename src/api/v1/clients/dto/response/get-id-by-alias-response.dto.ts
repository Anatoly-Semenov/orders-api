import { ApiProperty } from '@nestjs/swagger'

export class GetIdByAliasResponseDto {
	@ApiProperty()
	readonly id: number
}
