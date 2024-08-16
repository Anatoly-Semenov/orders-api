import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Services } from '../../services/entities/services.entity'
import { OrderAdditionalService } from './order-additional-service.entity'
import { OrderService } from './order-service.entity'

@Entity()
export class OrderServiceSnapshot {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'jsonb' })
	snapshot: Services

	@OneToOne(() => OrderService, (orderService) => orderService.service, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn()
	orderService: OrderService

	@OneToOne(
		() => OrderAdditionalService,
		(orderAdditionalService) => orderAdditionalService.service,
		{
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	)
	@JoinColumn()
	orderAdditionalServices: OrderAdditionalService[]
}
