import { Users } from '../../users/entities/users.entity'
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Unique,
	ManyToMany,
	OneToMany,
	ManyToOne,
} from 'typeorm'
import { ClientPaymentsSettingsMethods } from './clients-payments-settings-methods.entity'

@Entity()
export class ClientsPaymentsSettingsMethodsMeta {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	key: string

	@Column()
	value: string

	@ManyToOne(() => ClientPaymentsSettingsMethods, (method) => method.meta, {
		onDelete: 'CASCADE',
	})
	method: ClientPaymentsSettingsMethods[]
}
