import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
export class GetAllNotificationDto {
	@IsInt()
	@ApiProperty({
		description: 'App owner id',
	})
	appId: number
}
