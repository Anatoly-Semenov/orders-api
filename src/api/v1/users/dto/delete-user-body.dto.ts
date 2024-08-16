import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteUserBodyDto {
	@IsString()
	@ApiProperty()
	companyId: string
}
