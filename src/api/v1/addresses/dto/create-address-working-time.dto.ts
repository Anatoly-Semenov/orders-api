import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsMilitaryTime, IsOptional } from 'class-validator'
import { days } from '../enums/days.enum'

type TDayOptions = {
	value?: string
	dependence?: [string]
	multiply?: [string]
}

export class CreateAddressWorkingTimeDto {
	@IsEnum(days)
	@ApiProperty({
		enum: days,
		type: [days],
	})
	readonly day: days[]

	@IsMilitaryTime()
	@ApiProperty({
		description: 'Time working start',
	})
	readonly timeStart: string

	@IsMilitaryTime()
	@ApiProperty({
		description: 'Time working end',
	})
	readonly timeEnd: string

	@IsOptional()
	@ApiProperty({
		default: 0,
		description: 'Параметр для сортировки',
	})
	readonly sortPosition?: number = 0

	@IsOptional()
	@ApiProperty({
		description: 'id элемента на фронтенде, для валидации ошибок в случае дубликата',
	})
	readonly frontId?: number | string

	@ApiProperty({
		description: 'Массив опций даты для валидации и работы фронтенда',
	})
	readonly options: [TDayOptions]
}
