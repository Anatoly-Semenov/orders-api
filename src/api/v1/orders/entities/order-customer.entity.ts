import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm'
import { Language } from '../../users/enums/user.enums'
import { CreateOrderCustomerMetaDto } from '../dto/create-order-customer-meta.dto'
import { Orders } from './orders.entity'

@Entity()
export class OrderCustomer {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column({ unique: true, nullable: false })
	userEmail: string

	@Column({
		default: Language.RU,
	})
	language: string

	@Column({
		default: '',
	})
	phone: string

	@Column({
		default: '',
	})
	phoneIso: string

	@Column({
		type: 'json',
		nullable: true,
		default: {},
	})
	meta: CreateOrderCustomerMetaDto

	@OneToMany(() => Orders, (order) => order.customer, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	orders: Orders[]
}
