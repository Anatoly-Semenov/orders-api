import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString } from 'class-validator'
import { CreateClientsCategoriesTypesDto } from './create-clients-categories-types.dto'

export class UpdateClientsCategoriesTypesDto extends CreateClientsCategoriesTypesDto {
	@IsInt()
	@ApiProperty({
		required: true,
	})
	readonly id: number
}
