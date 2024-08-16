import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CreateUserMetaDto } from '../dto/user-meta.dto'
import { Users } from './users.entity'

@Entity()
export class UsersCandidate {
	@PrimaryGeneratedColumn()
	readonly id: number

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	readonly expire: Date

	@Column()
	readonly code: string

	@Column({
		default: '',
	})
	readonly phone: string

	@Column({
		default: '',
	})
	readonly phoneIso: string

	@Column({
		type: 'json',
		nullable: true,
		default: {},
	})
	readonly meta: CreateUserMetaDto

	@Column({
		default: '',
	})
	readonly email: string

	@Column({
		default: '',
	})
	readonly password: string
}
