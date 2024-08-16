import { Clients } from '../../../api/v1/clients/entities/clients.entity'
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Unique } from 'typeorm'

@Entity()
export class Notifications {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		length: '200',
	})
	customText: string

	@Column()
	type: string

	@ManyToOne(() => Clients, (client) => client.notifications, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	client: Clients
}
