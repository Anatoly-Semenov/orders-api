import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Services } from '../../services/entities/services.entity'

@Entity()
export class ServiceCategories {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@OneToMany(() => Services, (service) => service.category)
	services: Services[]
}
