import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateServicesPriceSettingParamsDto {
	@IsString()
	@IsOptional()
	@ApiProperty({
		description: 'Список дней для которых правило актуально через запятую',
		type: [String],
		required: false,
	})
	readonly weekDays: string[]

	@IsInt()
	@ApiProperty({
		description: 'Время начала действия параметра',
	})
	readonly timeStart: number

	@IsInt()
	@ApiProperty({
		description: 'Время окончания действия параметра',
	})
	readonly timeEnd: number

	@IsInt()
	@ApiProperty({
		description: 'Продолжительность. Параметр часов',
		required: false,
	})
	readonly durationHour?: number
	@IsInt()
	@ApiProperty({
		description: 'Продолжительность. Параметр минут',
		required: false,
	})
	readonly durationMinutes?: number

	@IsInt()
	@ApiProperty({
		description: 'Количество человек',
		required: false,
	})
	readonly amountPeople?: number

	@IsInt()
	@ApiProperty({
		description: 'Позиция для сортировки',
	})
	readonly sortPosition: number

	@IsInt()
	@ApiProperty({
		description: 'вкл/выкл',
	})
	readonly isDesabled: boolean

	@IsInt()
	@ApiProperty({
		description: 'Цена параметра',
		default: 0,
	})
	readonly amount: number
}
