import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { Role } from 'src/api/v1/users/enums/user-roles.enum'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'

export function Auth(...roles: Array<Role[]>) {
	return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard, RolesGuard))
}
