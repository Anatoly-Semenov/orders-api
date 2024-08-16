import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ServicesPriceSettings } from './services-price-settings.entity'

// @Entity()
export class ServicesPriceSettingsParams {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		type: 'json',
		nullable: true,
	})
	weekDays: string[]

	@Column({ default: 0 })
	timeStart: number

	@Column({ default: 0 })
	timeEnd: number

	@Column({
		default: 0,
	})
	durationHour: number

	@Column({
		default: false,
	})
	isDisabled: boolean

	@Column({
		default: 0,
	})
	durationMinutes: number

	@Column({
		default: 0,
	})
	amountPeople: number

	@Column({
		default: 0,
	})
	sortPosition: number

	@Column({ default: 0 })
	amount: number
}
