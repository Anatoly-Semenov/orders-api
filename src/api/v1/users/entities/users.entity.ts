import { Clients } from '../../clients/entities/clients.entity'
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	OneToMany,
	JoinTable,
	ManyToMany,
	Unique,
} from 'typeorm'
import { UsersRoles } from './users-roles.entity'
import { Orders } from '../../orders/entities/orders.entity'
import { UserSchedules } from '../../user-schedules/entities/user-schedule.entity'
import { UsersPhoto } from './users-photo.entity'
import { Exclude } from 'class-transformer'
import { UsersCard } from '../../users-cards/entities/users-card.entity'
import { Recurrent } from '../../recurrents/entities/recurrent.entity'
import { UsersHashs } from './users-hashs.entity'
import { CreateUserMetaDto } from '../dto/user-meta.dto'
import { Language } from '../enums/user.enums'
import { Files } from '../../files/entity/files.entity'

@Unique('user email and phone', ['userEmail', 'phone'])
@Entity()
export class Users {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	userEmail: string

	@Exclude()
	@Column()
	userPassword: string

	@Column({
		default: Language.RU,
	})
	language: string

	@Column({
		default: '',
	})
	phone: string

	@Column({
		default: '',
	})
	phoneIso: string

	@Column({ default: false })
	isEnable: boolean

	@ManyToMany(() => Clients, (client) => client.users, {
		cascade: ['insert', 'remove', 'update'],
	})
	@JoinTable()
	clients: Clients[]

	@OneToMany(() => Clients, (client) => client.owner, {
		cascade: ['insert', 'remove', 'update'],
	})
	ownClient: Clients

	@Column({
		type: 'json',
		nullable: true,
		default: {},
	})
	meta: CreateUserMetaDto

	@OneToMany(() => UsersCard, (card) => card.user, {
		cascade: ['insert', 'remove', 'update'],
		onDelete: 'CASCADE',
	})
	cards: UsersCard[]

	@ManyToMany(() => UsersRoles, (role) => role.user, {
		eager: true,
	})
	@JoinTable()
	roles: UsersRoles[]

	@OneToMany(() => Orders, (order) => order.user, {
		onDelete: 'CASCADE',
	})
	orders: Orders[]

	@OneToMany(() => UserSchedules, (schedule) => schedule.user, {
		cascade: ['insert', 'remove', 'update'],
		onDelete: 'CASCADE',
		eager: true,
	})
	schedule: UserSchedules[]

	@OneToMany(() => UsersPhoto, (photo) => photo.user, {
		cascade: ['insert', 'remove', 'update'],
		onDelete: 'CASCADE',
		eager: true,
	})
	photos: UsersPhoto[]

	@OneToOne(() => Recurrent, (recurrent) => recurrent.user, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	recurrent: UsersPhoto[]

	@OneToOne(() => UsersHashs, (hash) => hash.user, {
		cascade: ['remove'],
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	hash: UsersHashs

	@OneToMany(() => Files, (file) => file.user, {
		cascade: ['insert', 'remove', 'update'],
		onDelete: 'CASCADE',
		eager: true,
	})
	files: Files[]

	@Column({
		default: false,
	})
	isIntroduction: boolean
}
