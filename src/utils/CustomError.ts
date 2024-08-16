import { HttpException } from '@nestjs/common'

export class QBException extends HttpException {
	error: any
	constructor(message?: string | any, statusCode?: number, error?) {
		super(message, statusCode)
		this.error = error
	}
}
