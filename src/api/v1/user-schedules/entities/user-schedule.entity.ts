import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { Users } from '../../users/entities/users.entity'

@Entity()
export class UserSchedules {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		type: 'timestamp',
	})
	dateTimeStart: Date

	@Column({
		type: 'timestamp',
	})
	dateTimeEnd: Date

	@Column({
		default: 'Europe/Moscow',
	})
	timezone: string

	@Column({
		default: true,
	})
	isEnable: boolean

	@ManyToOne(() => Users, (user) => user.schedule, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	user: Users
}
