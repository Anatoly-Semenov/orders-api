import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import * as Sentry from '@sentry/node'
import { Auth } from '../../api/v1/auth/decorators/auth.decorator'
import { Role } from '../../api/v1/users/enums/user-roles.enum'
import { CreateNotifictionDto } from './dto/create-notification.dto'
import { DeleteNotificationDto } from './dto/delete-notification.dto'
import { GetAllNotificationDto } from './dto/get-all-notification.dto'
import { GetOneNotificationDto } from './dto/get-one-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { Notifications } from './entities/notification.entity'
import { NotificationsService } from './notifications.service'

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}
	// Create cat
	// Auth guard
	@Post('/add')
	async create(@Body() createNotifictionDto: CreateNotifictionDto): Promise<Notifications | Error> {
		try {
			return await this.notificationsService.create(createNotifictionDto)
		} catch (error) {
			Sentry.captureException(error)
			return error.message
		}
	}

	// Delete cat
	// Auth guard
	@Delete('/delete')
	delete(@Body() deleteNotificationDto: DeleteNotificationDto): Promise<number> {
		return this.notificationsService.delete(deleteNotificationDto)
	}
	// update
	// Auth guard
	@Put('/update')
	async update(
		@Body() updateNotificationDto: UpdateNotificationDto,
	): Promise<Notifications | Error> {
		try {
			return await this.notificationsService.update(updateNotificationDto)
		} catch (error) {
			Sentry.captureException(error)
			return error.message
		}
	}
	// get one
	// Auth guard
	@Get('/get/:id')
	getOne(@Param() getOneNotificationDto: GetOneNotificationDto): Promise<Notifications> {
		return this.notificationsService.getOne(getOneNotificationDto)
	}
	// get all
	// Auth guard
	@Get('/get/')
	getAll(@Body() getAllNotificationDto: GetAllNotificationDto): Promise<Notifications[]> {
		return this.notificationsService.getAll(getAllNotificationDto)
	}
}
