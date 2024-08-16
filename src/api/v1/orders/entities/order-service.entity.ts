import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { ServicesTarget } from '../../services/entities/service-target.entity'
import { Services } from '../../services/entities/services.entity'
import { OrderAdditionalService } from './order-additional-service.entity'
import { OrderFreeAdditionalService } from './order-free-additional-service.entity'
import { OrderServiceSnapshot } from './order-services-snapshot.entity'
import { Orders } from './orders.entity'

@Entity()
export class OrderService {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		default: '',
	})
	title: string

	@Column({
		default: 0,
		type: 'decimal',
	})
	price: number

	@Column({
		default: '',
	})
	type: string

	@Column({ default: 0 })
	seatsAmount: number

	@Column({ default: 0 })
	count: number

	@Column({ type: 'jsonb', default: [] })
	service: Services

	@OneToMany(() => OrderAdditionalService, (additionalService) => additionalService.orderService, {
		cascade: ['insert', 'update'],
		eager: true,
	})
	@JoinColumn()
	additionalServices: OrderAdditionalService[]

	@OneToMany(
		() => OrderFreeAdditionalService,
		(freeAdditionalService) => freeAdditionalService.orderService,
		{
			cascade: ['insert', 'update'],
			eager: true,
		},
	)
	@JoinColumn()
	freeAdditionalServices: OrderFreeAdditionalService[]

	@ManyToOne(() => Orders, (order) => order.orderServices, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	order: Orders

	@ManyToOne(() => ServicesTarget, (target) => target.order, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		eager: true,
	})
	target: ServicesTarget
}
