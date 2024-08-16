import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ThrowError } from 'src/decorators/ThrowError.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { Role } from '../users/enums/user-roles.enum'
import { CloneUserScheduleDto } from './dto/clone-user-schedule.dto'
import { CreateManyUserScheduleDto } from './dto/create-many-user-schedule.dto'
import { CreateUserScheduleDto } from './dto/create-user-schedule.dto'
import { DeleteUserScheduleDto } from './dto/delete-user-schedule.dto'
import { EnableUserScheduleDto } from './dto/enable-user-schedule.dto'
import { GetUserScheduleDto } from './dto/get-user-schedule.dto'
import { UpdateUserScheduleDto } from './dto/update-user-schedule.dto'
import { UserSchedules } from './entities/user-schedule.entity'
import { UserScheduleService } from './user-schedule.service'

@ApiTags('Users Schedules')
@Controller('user-schedule')
export class UserScheduleController {
	constructor(private readonly userScheduleService: UserScheduleService) {}

	// Auth guard
	@Post('/add')
	@ThrowError('user-schedule', 'create')
	create(@Body() createUserScheduleDto: CreateUserScheduleDto): Promise<UserSchedules | Error> {
		return this.userScheduleService.create(createUserScheduleDto)
	}

	// Auth guard
	@Post('/add')
	@ThrowError('user-schedule', 'createMany')
	createMany(
		@Body() createManyUserScheduleDto: CreateManyUserScheduleDto,
	): Promise<UserSchedules[]> {
		return this.userScheduleService.createMany(createManyUserScheduleDto)
	}

	// Auth guard
	@Post('/add')
	@ThrowError('user-schedule', 'clone')
	async clone(@Body() cloneUserScheduleDto: CloneUserScheduleDto): Promise<UserSchedules | Error> {
		return await this.userScheduleService.clone(cloneUserScheduleDto)
	}

	// Auth guard
	@Get('/get/')
	@ThrowError('user-schedule', 'get')
	get(@Body() getUserScheduleDto: GetUserScheduleDto): Promise<UserSchedules[]> {
		return this.userScheduleService.get(getUserScheduleDto)
	}

	// Auth guard
	@Delete('/delete/:id')
	@ThrowError('user-schedule', 'delete')
	delete(@Param() deleteUserScheduleDto: DeleteUserScheduleDto): Promise<number> {
		return this.userScheduleService.delete(deleteUserScheduleDto)
	}

	// Auth guard
	@Put('/update/')
	@ThrowError('user-schedule', 'update')
	async update(
		@Body() updateUserScheduleDto: UpdateUserScheduleDto,
	): Promise<UserSchedules | Error> {
		return await this.userScheduleService.update(updateUserScheduleDto)
	}

	@Post('/enable')
	@ThrowError('user-schedule', 'enable')
	async enable(@Body() enableUserScheduleDto: EnableUserScheduleDto): Promise<UserSchedules> {
		return await this.userScheduleService.enable(enableUserScheduleDto)
	}
}
