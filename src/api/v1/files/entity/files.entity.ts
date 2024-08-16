import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm'
import { Addresses } from '../../addresses/entities/address.entity'
import { Clients } from '../../clients/entities/clients.entity'
import { Services } from '../../services/entities/services.entity'
import { Users } from '../../users/entities/users.entity'
import { EFilesTags, EFilesHost } from '../enums/files.enum'

@Entity()
export class Files {
	@PrimaryGeneratedColumn()
	readonly id: number

	@Index()
	@Column()
	readonly fullPath: string

	@Column({
		default: EFilesTags.Photo,
	})
	readonly tag: EFilesTags

	@Column({
		default: EFilesHost.Server,
	})
	readonly host: EFilesHost

	@Column({
		default: 0,
	})
	readonly sortPosition: number

	@Column({
		default: '',
	})
	readonly mimetype: string

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	readonly created: string

	@ManyToOne(() => Clients, (client) => client.files, {
		onDelete: 'CASCADE',
	})
	client: Clients

	@ManyToOne(() => Services, (service) => service.files, {
		onDelete: 'CASCADE',
	})
	services: Services

	@ManyToOne(() => Addresses, (address) => address.files, {
		onDelete: 'CASCADE',
	})
	address: Addresses

	@ManyToOne(() => Users, (user) => user.files, {
		onDelete: 'CASCADE',
	})
	user: Users
}
