import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { Role } from 'src/api/v1/users/enums/user-roles.enum'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesExecludeGuard } from '../guards/roles-execlude.guard'

export function AuthExeclude(...roles: Array<Role[]>) {
	return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard, RolesExecludeGuard))
}
