import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { Users } from './users.entity'

@Entity()
export class UsersMeta {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	key: string

	@Column()
	value: string

	@ManyToOne(() => Users, (user) => user.meta, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	user: Users
}
