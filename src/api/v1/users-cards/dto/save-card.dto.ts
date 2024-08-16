import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SaveCardDto {
	@IsString()
	@ApiProperty({
		description: 'Card token after first payment',
	})
	token: string

	@IsString()
	@ApiProperty({
		description: 'First 4/6 card numbers',
	})
	firstNumbers: string
	@IsString()
	@ApiProperty({
		description: 'Last four card numbers',
	})
	lastNumbers: string
	@IsString()
	@ApiProperty({
		description: 'Issuer bank name',
	})
	bank: string

	@IsString()
	@ApiProperty({
		description: 'Visa, MasterCard etc.',
	})
	cardType: string

	@IsString()
	@ApiProperty({
		description: 'Card expire date',
	})
	cardExpDate: string
}
