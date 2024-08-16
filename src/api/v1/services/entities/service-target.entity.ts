import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { OrderService } from '../../orders/entities/order-service.entity'
// import { ServicesPriceSettings } from '../../services-price-settings/entities/services-price-settings.entity';
import { Services } from './services.entity'

@Entity()
export class ServicesTarget {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({
		default: false,
	})
	isDeleted: boolean

	@ManyToOne(() => Services, (service) => service.targets, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	readonly services: Services

	@OneToMany(() => OrderService, (orderService) => orderService.target)
	readonly order: OrderService[]

	@Column({ type: 'json', nullable: true })
	readonly servicePriceSettings: any[]
}
