import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Services } from './services.entity'

@Entity()
export class AdditionalEnableServices {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		default: false,
	})
	isEnable: boolean

	@Column({
		default: false,
	})
	isRequire: boolean

	@Column({
		default: false,
	})
	customerCanView: boolean

	@Column({ nullable: true })
	readonly childrenId: number

	@Index()
	@ManyToOne(() => Services, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	readonly parent: Services
}
