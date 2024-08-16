import { ApiProperty } from '@nestjs/swagger'

export class RelationDto {
	@ApiProperty()
	id: number
}
export class CreateUserInviteDto {
	@ApiProperty({ required: true })
	email: string

	@ApiProperty({
		required: true,
		default: 'http://localhost:3000/invite/:id',
		description:
			'В ссылке должна быть указана строка :id - на бэкенеде она будет заменена автоматом',
	})
	returnUrl: string

	@ApiProperty({ required: true, type: [RelationDto] })
	roles: RelationDto[]

	@ApiProperty({ required: true, type: RelationDto })
	client: RelationDto
}
