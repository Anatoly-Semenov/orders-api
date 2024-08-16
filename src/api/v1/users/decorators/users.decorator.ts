import { createParamDecorator } from '@nestjs/common'

export const User = createParamDecorator((data: string, ctx: any) => {
	return ctx.args[0].user
})
