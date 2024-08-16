import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { Users } from './users.entity'

@Entity()
export class UsersHashs {
	@PrimaryGeneratedColumn()
	readonly id: number

	@Column()
	readonly expire: number

	@Column({
		default: null,
	})
	readonly hash: string

	@OneToOne(() => Users, (user) => user.hash, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	readonly user: Users
}
