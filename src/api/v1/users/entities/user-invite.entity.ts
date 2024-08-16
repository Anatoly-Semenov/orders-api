import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Clients } from '../../clients/entities/clients.entity'
import { UsersRoles } from './users-roles.entity'

@Entity()
export class UserInvite {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	email: string

	@Column({ unique: true })
	hash: string

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	created: Date

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updated: Date

	@ManyToMany(() => UsersRoles, (role) => role.userInvite, {
		eager: true,
	})
	@JoinTable()
	roles: UsersRoles[]

	@ManyToMany(() => Clients, (client) => client.usersInvites, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		eager: true,
	})
	@JoinTable()
	clients: Clients[]
}
