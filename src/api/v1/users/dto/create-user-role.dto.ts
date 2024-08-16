import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt } from 'class-validator'
import { Role } from '../enums/user-roles.enum'

export class CreateUserRoleDto {
	@IsInt()
	@ApiProperty()
	readonly id: number

	@IsEnum(Role)
	@ApiProperty({
		enum: Role,
	})
	readonly name: Role
}
