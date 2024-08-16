import { IsInt } from 'class-validator'

export class GetAllClientsDto {
	@IsInt()
	userId: number
}
