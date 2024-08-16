import { Recurrent } from 'src/api/v1/recurrents/entities/recurrent.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity()
export class Rate {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	description: string

	@Column()
	amount: number

	@Column()
	saleAmount: number

	@OneToMany(() => Recurrent, (recurrent) => recurrent.rate)
	recurrents: Recurrent[]
}
