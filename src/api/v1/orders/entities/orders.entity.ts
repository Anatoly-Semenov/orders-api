import { Users } from '../../users/entities/users.entity'
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm'
import { EOrderSource, OrderPaymentStatuses, SaleTypes, Statuses } from '../enums/orders.enums'
import { Currency } from '../../payments/enums/payments.enum'
import { OrderService } from './order-service.entity'
import { Addresses } from '../../addresses/entities/address.entity'
import { OrderCustomer } from './order-customer.entity'
import { Clients } from '../../clients/entities/clients.entity'
import { Payments } from '../../payments/entities/payment.entity'
import { PaymentsService } from '../../payments/payments.service'
import { Injectable } from '@nestjs/common'

@Injectable()
@Entity()
export class Orders {
	constructor(readonly paymentServiceInstance: PaymentsService) {
		this.paymentService = paymentServiceInstance
	}
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		length: 500,
		default: '',
	})
	comment: string

	@Column({
		default: 2400,
		type: 'decimal',
	})
	price: number

	@Column({
		enum: EOrderSource,
		default: EOrderSource.SUBCLIENT,
	})
	orderSource: EOrderSource

	@Column({
		default: 0,
	})
	sale: number

	@Column({
		default: SaleTypes.Percent,
		enum: SaleTypes,
	})
	saleType: SaleTypes

	@Column({
		default: false,
	})
	isTechnicalReservation: boolean

	@Column({
		default: Statuses.Created,
		nullable: true,
	})
	status: Statuses

	@Column({
		default: 0,
	})
	amount: number

	@Column({
		default: Currency.RUB,
		enum: Currency,
	})
	currency: Currency

	@Column({
		enum: OrderPaymentStatuses,
		default: OrderPaymentStatuses.WITHOUT_PAYEMNT,
	})
	paymentStatus: OrderPaymentStatuses

	@Column({
		default: 0,
	})
	discount: number

	@Column({
		default: 'Europe/Moscow',
	})
	datetimezone: string

	@Column({
		default: true,
	})
	allowNotifications: boolean

	@Column({
		default: '',
	})
	discountType: string

	@Column({
		default: 0,
	})
	duration: number

	@Column({
		default: false,
	})
	isCompleted: boolean

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	dateTimeStart: Date

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	dateTimeEnd: Date
	@Column({ default: false })
	createFirstPaymentInBank: boolean

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	created: Date

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updated: Date

	@OneToMany(() => OrderService, (orderService) => orderService.order, {
		cascade: ['insert', 'update', 'remove'],
		onDelete: 'CASCADE',
		eager: true,
	})
	orderServices: OrderService[]

	@ManyToOne(() => Users, (user) => user.orders, {
		cascade: ['insert', 'update'],
		onDelete: 'CASCADE',
		eager: true,
	})
	user: Users

	@ManyToOne(() => OrderCustomer, (customer) => customer.orders, {
		cascade: ['insert', 'update', 'remove'],
		eager: true,
	})
	customer: OrderCustomer

	@OneToMany(() => Payments, (payment) => payment.order, {
		cascade: ['remove', 'update'],
		eager: true,
	})
	payments: Payments[]

	@ManyToOne(() => Addresses, (address) => address.orders, {
		onUpdate: 'CASCADE',
		eager: true,
	})
	address: Addresses

	@ManyToOne(() => Clients, (client) => client.orders, {
		onUpdate: 'CASCADE',
	})
	client: Clients

	paymentService: PaymentsService
}
