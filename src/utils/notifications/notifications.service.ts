import { HttpService } from '@nestjs/axios'
import {
	ClassSerializerInterceptor,
	Inject,
	Injectable,
	InternalServerErrorException,
	UseInterceptors,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateNotifictionDto } from './dto/create-notification.dto'
import { DeleteNotificationDto } from './dto/delete-notification.dto'
import { GetAllNotificationDto } from './dto/get-all-notification.dto'
import { GetOneNotificationDto } from './dto/get-one-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { Notifications } from './entities/notification.entity'
import { ClientProxy } from '@nestjs/microservices'
import { SendEmailHtmlDto } from './dto/send-email-html.dto'
import { ConfigService } from '@nestjs/config'
import { SmtpConfig } from '../../config/smtp.config'
import { Config } from '../../config/main.config'

@UseInterceptors(ClassSerializerInterceptor)
@Injectable()
export class NotificationsService {
	constructor(
		private httpService: HttpService,

		private configService: ConfigService,

		@InjectRepository(Notifications)
		private notificationsRepository: Repository<Notifications>,

		@Inject('SUBSCRIBERS_SERVICE')
		private subscribersService: ClientProxy,
	) {}

	async create(createNotifictionDto: CreateNotifictionDto): Promise<Notifications | Error> {
		const candidate = {
			...createNotifictionDto,
			client: {
				id: createNotifictionDto.appId,
			},
		}
		return await this.notificationsRepository.save(candidate)
	}

	// update
	async update(updateNotificationDto: UpdateNotificationDto): Promise<Notifications | Error> {
		const candidate = {
			...updateNotificationDto,
			client: {
				id: updateNotificationDto.appId,
			},
		}
		return await this.notificationsRepository.save(candidate)
	}
	// delete
	async delete(deleteNotificationDto: DeleteNotificationDto): Promise<number> {
		const category = await this.notificationsRepository.delete({
			id: deleteNotificationDto.id,
		})
		return category.affected
	}
	// get
	async getAll(getAllNotificationDto: GetAllNotificationDto): Promise<Notifications[]> {
		return await this.notificationsRepository.find({
			where: {
				client: {
					id: getAllNotificationDto.appId,
				},
			},
		})
	}

	// get one
	async getOne(getOneNotificationDto: GetOneNotificationDto): Promise<Notifications> {
		return await this.notificationsRepository.findOne(getOneNotificationDto.id)
	}

	async sendEmail(to, childs, email, createEmail = true, html = null): Promise<any> {
		let data
		if (createEmail) {
			data = await this.createEmail(to, childs, email)
		}
		if (html) {
			data = html
		}
		if (!data && !html) {
			throw new InternalServerErrorException('no notification data or email')
		}

		const check = this.subscribersService.emit('add-client-message', data)

		return 'ok'
	}

	async sendEmailHtml(dto: SendEmailHtmlDto) {
		const data = await this.createEmailHtml(dto)
		this.subscribersService.emit('add-client-message', data)
	}

	async createEmail(to, childs, email): Promise<any> {
		const { name, login, password, port, host } = this.configService.get<SmtpConfig>(Config.SMTP)

		return {
			fromEmail: `${email.name ? email.name : name} <${email.login ? email.login : login}>`,
			toEmail: to,
			subjectEmail: email.subject,
			childs: childs,
			authorization: {
				login: email.login ? email.login : login,
				password: email.password ? email.password : password,
				port: email.port ? email.port : port,
				host: email.host ? email.host : host,
			},
		}
	}

	async createEmailHtml(dto: SendEmailHtmlDto): Promise<any> {
		const { name, login, password, port, host } = this.configService.get<SmtpConfig>(Config.SMTP)

		return {
			fromEmail: `${dto.name || name} <${login}>`,
			toEmail: dto.to,
			subjectEmail: dto.subject,
			html: dto.html,
			authorization: {
				login: login,
				password: password,
				port: port,
				host: host,
			},
		}
	}
}
