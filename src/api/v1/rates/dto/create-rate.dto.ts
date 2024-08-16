import { ApiProperty } from '@nestjs/swagger'

export class CreateRateDto {
	@ApiProperty()
	name: string

	@ApiProperty()
	description: string

	@ApiProperty()
	amount: number

	@ApiProperty()
	saleAmout?: number = 0
}
