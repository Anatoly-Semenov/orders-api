import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, MaxLength } from 'class-validator'
import { NotificationTypes } from '../enums/notification.enums'

export class CreateNotifictionDto {
	@MaxLength(200)
	@ApiProperty({
		description: 'Notification custom text',
		maxLength: 200,
	})
	readonly customText: string

	@IsInt()
	@ApiProperty({
		description: 'App owner id',
	})
	appId: number

	@IsEnum(NotificationTypes)
	@ApiProperty({
		description: 'App owner id',
		enum: NotificationTypes,
	})
	type: NotificationTypes
}
