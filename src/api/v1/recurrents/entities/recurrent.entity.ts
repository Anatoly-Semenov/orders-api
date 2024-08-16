import { Rate } from '../../rates/entities/rate.entity'
import { Users } from '../../users/entities/users.entity'
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ERecurrentStatus } from '../enums/recurrent.enum'

@Entity()
export class Recurrent {
	@PrimaryGeneratedColumn()
	readonly id: number

	@OneToOne(() => Users, (user) => user.recurrent)
	readonly user: Users

	@ManyToOne(() => Rate, (rate) => rate.recurrents, {
		eager: true,
	})
	readonly rate

	@Column({
		type: 'timestamp',
	})
	readonly expire: Date

	@Column()
	readonly recurrentId: string

	@Column({
		default: ERecurrentStatus.Active,
	})
	readonly status: string
}
