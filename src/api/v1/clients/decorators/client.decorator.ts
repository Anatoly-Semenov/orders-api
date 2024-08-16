import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Client = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()

	const b64auth = (request.headers.authorization || '').split(' ')[1] || ''
	const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':')

	return username
})
