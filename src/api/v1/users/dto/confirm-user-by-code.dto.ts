import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsString } from 'class-validator'

export class ConfirmUserByCodeDto {
	@IsString()
	@ApiProperty()
	userEmail: string

	@IsString()
	@ApiProperty()
	phone: string

	@IsString()
	@IsInt()
	@ApiProperty()
	code: number | string

	@IsArray()
	@ApiProperty({ description: 'Role id', type: [Number], default: [1] })
	roles?: number[] = [1]
}
