import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ServicesTarget } from '../../services/entities/service-target.entity'
import { Services } from '../../services/entities/services.entity'
import { ServicesPriceSettingsParams } from './services-price-settings-params.entity'

// @Entity()
export class ServicesPriceSettings {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	action: string

	@Column({ nullable: true, type: 'timestamp' })
	dateStart: Date

	@Column({ nullable: true, type: 'timestamp' })
	dateEnd: Date

	@Column({ default: false })
	unimportantTarget: boolean

	@ManyToOne(() => Services, (service) => service.priceSettings, {
		onDelete: 'CASCADE',
	})
	service: Services
}
