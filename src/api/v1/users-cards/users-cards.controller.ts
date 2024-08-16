import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { User } from 'src/api/v1/users/decorators/users.decorator'
import { ThrowError } from 'src/decorators/ThrowError.decorator'
import { SaveCardDto } from './dto/save-card.dto'
import { UsersCardsService } from './users-cards.service'

@Controller('users-cards')
export class UsersCardsController {
	constructor(private readonly usersCardsService: UsersCardsService) {}

	@Post()
	@ThrowError('user-cards', 'saveCard')
	saveCard(@User() user, @Body() saveCardDto: SaveCardDto) {
		return this.usersCardsService.saveCard(+user.id, saveCardDto)
	}

	@Get()
	@ThrowError('user-cards', 'findAll')
	findAll() {
		return this.usersCardsService.findAll()
	}

	@Get(':id')
	@ThrowError('user-cards', 'findOneById')
	findOneById(@Param('id') id: string) {
		return this.usersCardsService.findOneById(+id)
	}

	@Get(':token')
	@ThrowError('user-cards', 'findOneByToken')
	findOneByToken(@Param('token') token: string) {
		return this.usersCardsService.findOneByToken(token)
	}

	@Delete(':id')
	@ThrowError('user-cards', 'delete')
	remove(@Param('id') id: string) {
		return this.usersCardsService.delete(+id)
	}
}
