import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { ClientsCategories } from './clients-categories.entity'

@Unique(['name'])
@Entity()
export class ClientsCategoriesTypes {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	description: string

	@Column({
		default: true,
	})
	isEnable: boolean

	@ManyToOne(() => ClientsCategories, (category) => category.types, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	category: ClientsCategories
}
