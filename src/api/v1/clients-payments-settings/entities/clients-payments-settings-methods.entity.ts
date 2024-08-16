import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Unique,
	ManyToMany,
	OneToMany,
	ManyToOne,
	JoinColumn,
	OneToOne,
} from 'typeorm'
import { ClientPaymentsSettings } from './clients-payments-settings.entity'
import { ClientsPaymentsSettingsMethodsMeta } from './clients-payments-settings-methods-meta.entity'

@Entity()
export class ClientPaymentsSettingsMethods {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@OneToMany(() => ClientsPaymentsSettingsMethodsMeta, (meta) => meta.method, {
		cascade: ['insert', 'remove', 'update'],
		onDelete: 'CASCADE',
		eager: true,
	})
	meta: ClientsPaymentsSettingsMethodsMeta[]

	@ManyToOne(() => ClientPaymentsSettings, (payment) => payment.methods, {
		onDelete: 'CASCADE',
	})
	paymentSettings: ClientPaymentsSettings[]
}
