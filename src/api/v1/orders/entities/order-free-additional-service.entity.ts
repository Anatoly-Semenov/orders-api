import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { OrderService } from './order-service.entity'
import { Services } from '../../services/entities/services.entity'

@Entity()
export class OrderFreeAdditionalService {
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

	@ManyToOne(() => OrderService, (service) => service.freeAdditionalServices, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	orderService: OrderService

	@Column({ type: 'jsonb', default: {} })
	service: Services
}
