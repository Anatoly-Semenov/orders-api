import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Unique,
	ManyToMany,
	OneToMany,
	OneToOne,
} from 'typeorm'
import { ClientPaymentsSettingsMethods } from './clients-payments-settings-methods.entity'
import { Clients } from '../../clients/entities/clients.entity'

@Entity()
export class ClientPaymentsSettings {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	expire: number

	@Column({ default: false })
	taxAccount: boolean

	@Column({ default: 'RUB' })
	currency: string

	@Column({ default: true })
	isEnable: boolean

	@OneToMany(() => ClientPaymentsSettingsMethods, (method) => method.paymentSettings, {
		cascade: ['insert', 'remove', 'update'],
		onDelete: 'CASCADE',
		eager: true,
	})
	methods: ClientPaymentsSettingsMethods[]

	@OneToOne(() => Clients, (client) => client.payment, {
		onDelete: 'CASCADE',
	})
	client: Clients
}
