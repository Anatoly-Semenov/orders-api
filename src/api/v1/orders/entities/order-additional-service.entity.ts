import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { ServicesTarget } from '../../services/entities/service-target.entity'
import { Services } from '../../services/entities/services.entity'
import { OrderService } from './order-service.entity'
import { OrderServiceSnapshot } from './order-services-snapshot.entity'
import { Orders } from './orders.entity'

@Entity()
export class OrderAdditionalService {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ default: '' })
	title: string

	@Column({ default: '' })
	additionalType: string

	@Column({ default: '' })
	paymentTypes: string

	@Column({ default: 0 })
	duration: number

	@Column({ default: 0, nullable: true })
	count: number

	@Column({ default: 0, type: 'decimal' })
	price: number

	@ManyToOne(() => OrderService, (service) => service.additionalServices, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	orderService: OrderService

	@Column({ type: 'jsonb', default: {} })
	service: Services
}
