import { Users } from '../users/entities/users.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm'

@Entity()
export class Tokens {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => Users, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: Users

	@Column('text')
	refreshToken: string
}
