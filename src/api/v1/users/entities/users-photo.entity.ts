import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

import { Users } from './users.entity'

@Entity()
export class UsersPhoto {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	path: string

	@ManyToOne(() => Users, (user) => user.photos, {
		onDelete: 'CASCADE',
	})
	user: Users
}
