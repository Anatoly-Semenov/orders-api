import { PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Entity } from 'typeorm'
import { EClientIntegrationKeys } from '../enums/client.enums'
import { Clients } from './clients.entity'

@Entity()
export class ClientIntegration {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		enum: EClientIntegrationKeys,
	})
	key: EClientIntegrationKeys

	@Column({
		type: 'jsonb',
	})
	value: any

	@ManyToOne(() => Clients, (client) => client.integrations, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	client: Clients
}
