import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { Addresses } from './address.entity'

@Entity()
export class AddressesWorkingTime {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		type: 'json',
		default: [],
	})
	day: string[]

	@Column({
		type: 'json',
		default: [],
	})
	options: string[]

	@Column()
	timeStart: string

	@Column()
	timeEnd: string

	@Column({
		default: 0,
	})
	sortPosition: number

	@ManyToOne(() => Addresses, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	address: Addresses
}
