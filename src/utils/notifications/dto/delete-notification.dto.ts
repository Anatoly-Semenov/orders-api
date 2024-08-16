import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
export class DeleteNotificationDto {
	@IsInt()
	@ApiProperty({
		description: 'Nitification id',
	})
	id: number
}
