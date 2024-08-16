import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	ManyToOne,
	ManyToMany,
	OneToMany,
	CreateDateColumn,
	DeleteDateColumn,
	JoinTable,
} from 'typeorm'
import { Clients } from '../../clients/entities/clients.entity'
import { AddressesWorkingTime } from './address-working-time.entity'

import { Services } from '../../services/entities/services.entity'
import { Files } from '../../files/entity/files.entity'
import { Orders } from '../../orders/entities/orders.entity'

@Entity()
export class Addresses {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	country: string

	@Column()
	countryIsoCode: string

	@Column({
		default: '',
	})
	postalCode: string

	@Column({
		default: null,
	})
	house: number

	@Column({
		default: null,
	})
	block?: string

	@Column({
		default: null,
	})
	floor?: number

	@Column({
		default: '',
	})
	office?: string

	@Column({
		default: null,
	})
	geoLat: number

	@Column({
		default: null,
	})
	geoLon: number

	@Column()
	city: string

	@Column({
		default: '',
	})
	street: string

	@Column({
		default: 'Europe/Moscow',
	})
	timezone: string

	@Column({
		default: true,
	})
	isActive: boolean

	@Column({
		default: true,
	})
	isEnable: boolean

	@Column({
		default: 0,
	})
	readonly sortPosition: number

	@CreateDateColumn()
	created: Date

	@DeleteDateColumn()
	deleted: Date

	@ManyToOne(() => Clients, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	client: Clients

	@ManyToMany(() => Services)
	@JoinTable({
		name: 'service_addresses',
	})
	services: Services[]

	@OneToMany(() => AddressesWorkingTime, (working) => working.address, {
		cascade: ['insert', 'remove', 'update'],

		eager: true,
	})
	workingTime: AddressesWorkingTime[]

	@OneToMany(() => Files, (file) => file.address, {
		cascade: ['insert', 'remove', 'update'],

		eager: true,
	})
	files: Files[]

	@OneToMany(() => Orders, (order) => order.address)
	orders: Orders[]
}
