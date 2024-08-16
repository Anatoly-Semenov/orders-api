import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Orders } from '../../orders/entities/orders.entity'
import { OrderPaymentStatuses } from '../../orders/enums/orders.enums'
import { EPaymentTypes } from '../../services/enums/service.enum'
import {
	Currency,
	EPaymentMethod,
	EPaymentProvider,
	EPaymentType,
	Language,
} from '../enums/payments.enum'
import { ETinkoffPaymentMethod } from '../enums/tinkoff/tinkoff.enum'
@Entity()
export class Payments {
	@PrimaryGeneratedColumn()
	readonly id: number

	@Column({ default: 0, type: 'decimal' })
	amount: number

	@Column({ enum: Currency, default: Currency.RUB })
	currency: Currency

	@Column({ enum: Language, default: Language.RU })
	language: Language

	@Column({ enum: OrderPaymentStatuses, default: OrderPaymentStatuses.NOTPAID })
	status: OrderPaymentStatuses

	@Column({ enum: EPaymentProvider, default: EPaymentProvider.TINKOFF })
	provider: EPaymentProvider

	@Column({
		default: '',
	})
	providerPaymentId: string

	@Column({
		default: '',
	})
	providerPaymentURL: string

	@Column({
		default: '',
	})
	providerPaymentDetails: string

	@Column({
		default: '',
	})
	providerPaymentStatusCode: string

	@Column({
		default: '',
	})
	providerPaymentStatusComment: string
	@Column({
		default: '',
	})
	providerPaymentErrorCode: string

	@Column({
		default: false,
	})
	isFree: boolean

	@Column({
		default: true,
	})
	createFirstPaymentInBank: boolean

	@Column({
		enum: ETinkoffPaymentMethod,
		default: ETinkoffPaymentMethod.PREPAYMENT,
	})
	providerPaymentMethod: ETinkoffPaymentMethod

	@Column({
		enum: EPaymentMethod,
		default: EPaymentMethod.OTHER,
	})
	method: EPaymentMethod

	@Column({
		enum: EPaymentType,
		default: EPaymentType.PREPAYMENT,
	})
	type: EPaymentType

	@ManyToOne(() => Orders, (order) => order.payments, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	order: Orders

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	created: Date

	tempPayementProviderUrl: string
}
