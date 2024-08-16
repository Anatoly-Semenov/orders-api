import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Unique } from 'typeorm'
import { Role } from '../enums/user-roles.enum'
import { UserInvite } from './user-invite.entity'
import { Users } from './users.entity'

@Entity()
export class UsersRoles {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: Role

	@ManyToMany(() => Users, (user) => user.roles)
	user: Users[]

	@ManyToMany(() => UserInvite, (user) => user.roles)
	userInvite: UserInvite[]
}
