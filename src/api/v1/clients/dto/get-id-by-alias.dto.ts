import { ApiProperty } from '@nestjs/swagger'

export class GetClientIdByAliasDto {
	@ApiProperty({
		description: 'Unique alias for this company',
	})
	readonly idAlias: string
}
