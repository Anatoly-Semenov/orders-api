import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreatePaymentDto } from './dto/payment/create-payment.dto'
import { PaymentsService } from './payments.service'
import { Payments } from './entities/payment.entity'

@ApiTags('Order payments')
@Controller('payments')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {}

	@ApiOperation({
		operationId: 'add-payment',
		summary: 'Создание платежа',
		description: 'Создаст новый платеж',
	})
	@ApiResponse({
		status: 201,
		description: 'Вренет объект со ссылкой на страницу оплаты и статуы isFree',
	})
	@ApiBody({
		type: CreatePaymentDto,
		required: true,
	})
	@Post('/create')
	async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payments> {
		return await this.paymentsService.createPayment(createPaymentDto)
	}
}
