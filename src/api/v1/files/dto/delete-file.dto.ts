import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString } from 'class-validator'

export class DeleteFileDto {
	@ApiProperty({
		description: 'File id',
	})
	@IsString()
	@IsInt()
	readonly id: string | number
}
