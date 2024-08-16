import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { Clients } from './clients.entity'

@Entity()
export class ClientsMeta {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	key: string

	@Column()
	value: string

	@ManyToOne(() => Clients, (client) => client.meta, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	client: Clients
}
