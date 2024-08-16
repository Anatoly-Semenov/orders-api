import { Users } from '../../users/entities/users.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class UsersCard {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	token: string

	@Column()
	firstNumbers: string

	@Column()
	lastNumbers: string

	@Column()
	bank: string

	@Column()
	cardType: string

	@Column()
	cardExpDate: string

	@ManyToOne(() => Users, (user) => user.cards, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	user: Users
}
