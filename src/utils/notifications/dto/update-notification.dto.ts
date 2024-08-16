import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CreateNotifictionDto } from './create-notification.dto'

export class UpdateNotificationDto extends CreateNotifictionDto {
	@IsInt()
	@ApiProperty({
		description: 'Nitification id',
	})
	id: number
}
