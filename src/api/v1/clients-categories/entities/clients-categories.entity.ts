import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm'
import { ClientsCategoriesTypes } from './clients-categories-types.entity'

@Unique(['name'])
@Entity()
export class ClientsCategories {
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

	@OneToMany(() => ClientsCategoriesTypes, (type) => type.category, {
		cascade: ['insert', 'remove', 'update'],
		onDelete: 'CASCADE',
		eager: true,
	})
	types: ClientsCategoriesTypes[]
}
