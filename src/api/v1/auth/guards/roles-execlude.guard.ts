import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import jwtDecode from 'jwt-decode'
import { ROLES_KEY } from '../../users/decorators/roles.decorator'
import { Role } from '../../users/enums/user-roles.enum'

@Injectable()
export class RolesExecludeGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (!requiredRoles) {
			return true
		}
		const request = context.switchToHttp().getRequest()
		const b64auth = (request.headers.authorization || '').split(' ')[1] || ''
		const decode = jwtDecode(b64auth)
		const controlResultRoles = requiredRoles.some((roles) => {
			const check = decode['user'].roles.filter((r) => {
				return !roles.includes(r.name)
			}).length
			return !check
		})
		return controlResultRoles
	}
}
