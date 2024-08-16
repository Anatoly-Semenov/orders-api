import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToMany,
	OneToMany,
	OneToOne,
	JoinColumn,
	ManyToOne,
} from 'typeorm'
import { Addresses } from '../../addresses/entities/address.entity'
import { ClientPaymentsSettings } from '../../clients-payments-settings/entities/clients-payments-settings.entity'
import { Users } from '../../users/entities/users.entity'
import { Notifications } from 'src/utils/notifications/entities/notification.entity'
import { Services } from '../../services/entities/services.entity'
import { Files } from '../../files/entity/files.entity'
import { CreateClientsMetaDto } from '../dto/client-meta.dto'
import { ClientsMeta } from './client-meta.entity'
import { Orders } from '../../orders/entities/orders.entity'
import { ClientMerchantData } from './client-merchant-data.entity'
import { ClientIntegration } from './client-integration.entity'
import { UserInvite } from '../../users/entities/user-invite.entity'
import { Currency } from '../../payments/enums/payments.enum'

@Entity()
export class Clients {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	idAlias: string

	@Column()
	clientName: string

	@Column({
		default: '',
		length: '200',
	})
	clientDescription: string

	@Column()
	clientUrl: string

	@Column()
	secretKey: string

	@Column()
	testSecretKey: string

	@Column({ default: false })
	isEnable: boolean

	@Column({ default: false })
	isTest: boolean

	@Column({
		default: 'Europe/Moscow',
	})
	timezone: string

	@Column({
		default: 1,
	})
	copyVersion: number

	@Column({
		default: 60,
	})
	calendarTimeStep: number

	@Column({
		default: Currency.RUB,
		enum: Currency,
	})
	currency: Currency

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	created: Date

	@Column({
		default: 60 * 60 * 24,
	})
	paymentLinkSeconds: number

	@ManyToMany(() => Users, (user) => user.clients, {
		onDelete: 'CASCADE',
		eager: true,
	})
	users: Users[]

	@ManyToMany(() => UserInvite, (user) => user.clients, {
		cascade: ['insert', 'update', 'remove'],
	})
	usersInvites: UserInvite[]

	/// Вот это костыль, вставил ради того чтобы прод ожил, срочно нужно с ним что то решать
	/// Была ошибка что при запросе clients/get/all база пытается найти коллонку usersInvitedId а ее нету
	@ManyToOne(() => UserInvite)
	usersInvite: UserInvite[]
	/// Тут костыль закончен

	@ManyToOne(() => Users, (user) => user.ownClient, {
		onDelete: 'CASCADE',
		eager: true,
	})
	owner: Users

	@Column({
		type: 'json',
		nullable: true,
		default: {},
	})
	meta: CreateClientsMetaDto

	@OneToMany(() => Addresses, (address) => address.client, {
		cascade: ['insert', 'remove', 'update'],
		eager: true,
	})
	addresses: Addresses[]

	@OneToMany(() => ClientIntegration, (integration) => integration.client, {
		cascade: ['insert', 'remove', 'update'],
	})
	integrations: ClientIntegration[]

	@OneToOne(() => ClientPaymentsSettings, (payment) => payment.client, {
		cascade: ['insert', 'remove', 'update'],
		eager: true,
	})
	@JoinColumn()
	payment: ClientPaymentsSettings

	@OneToOne(() => ClientMerchantData, (merchantData) => merchantData.client, {
		cascade: ['insert', 'remove', 'update'],
	})
	@JoinColumn()
	merchantData: ClientMerchantData

	@OneToMany(() => Services, (service) => service.client, {
		cascade: ['insert', 'remove', 'update'],
		// eager: true,
	})
	services: Services[]

	@OneToMany(() => Notifications, (notification) => notification.client, {
		cascade: ['insert', 'remove', 'update'],
		eager: true,
	})
	notifications: Notifications[]

	@OneToMany(() => Files, (file) => file.client, {
		cascade: ['insert', 'remove', 'update'],
		eager: true,
	})
	files: Files[]

	@OneToMany(() => Orders, (order) => order.client)
	orders: Orders[]
}
