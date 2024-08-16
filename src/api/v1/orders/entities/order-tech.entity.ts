import { PickType } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Orders } from './orders.entity'

@Entity()
export class OrderTech extends PickType(Orders, [
	'orderServices',
	'address',
	'comment',
	'dateTimeStart',
	'dateTimeEnd',
	'created',
	'user',
	'client',
]) {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		default: false,
	})
	isTechnicalReservation: boolean
}
