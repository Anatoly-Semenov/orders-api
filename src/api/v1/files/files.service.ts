import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as _ from 'lodash'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClientsService } from '../clients/clients.service'
import { ServicesService } from '../services/services.service'

import { UsersService } from '../users/users.service'
import { SaveFileDto } from './dto/save-file.dto'
import { Files } from './entity/files.entity'
import { EFiles, EFilesHost, EFilesTags } from './enums/files.enum'
import { AddressesService } from '../addresses/addresses.service'
import { FileDto } from './dto/file.dto'
import { Cron } from '@nestjs/schedule'
import {
	DeleteObjectCommand,
	GetObjectCommand,
	GetObjectCommandOutput,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client,
} from '@aws-sdk/client-s3'
import { GetFileDto } from './dto/get-file.dto'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class FilesService {
	private storage: S3Client
	private bucket: string
	private storageEndpoint: string

	constructor(
		@InjectRepository(Files)
		private filesRepository: Repository<Files>,
		private userService: UsersService,
		private clientsService: ClientsService,
		private servicesService: ServicesService,
		private addressService: AddressesService,
		private httpService: HttpService,
	) {
		this.bucket = 'qbp_photos'
		this.storageEndpoint = 'https://digitaloceanspaces.com'
		this.storage = new S3Client({
			forcePathStyle: false, // Configures to use subdomain/virtual calling format.
			endpoint: this.storageEndpoint,
			region: 'us-east-1',
			credentials: {
				accessKeyId: 'DO00UCNJULUWGYEE2FTY',
				secretAccessKey: 'Rr7Sr7/2cy4a0xQyz0cP2IowFwyj3udIVZfVerHl5ho',
			},
		})
	}
	private readonly logger = new Logger(FilesService.name)

	async saveFileToStorage(saveFileDto: SaveFileDto, userId, files) {
		try {
			const access = await this.accessEntity(saveFileDto, userId)

			if (!access) {
				throw new BadRequestException('Not found services, clients or address')
			}
			// Если все ок сохраняем
			const result = []

			const oldFiles = files.files.filter((f) => f.id)

			files.files = files.files.filter((f) => !f.id)

			if (files) {
				for (const file of files.files) {
					try {
						let destination = file.originalname.split('.')
						destination = destination[destination.length - 1]
						destination =
							Date.now() +
							String(userId) +
							String(saveFileDto.appId) +
							file.originalname.replace(/([\s\W])/g, '').replace(destination, '') +
							'.' +
							destination
						const bucketParams: PutObjectCommandInput = {
							Bucket: this.bucket,
							Key: destination,
							Body: file.buffer,
							ContentEncoding: 'base64',
							ContentType: 'image/jpeg',
							ACL: 'public-read',
						}

						await this.storage.send(new PutObjectCommand(bucketParams))

						result.push({
							fullPath: destination,
							mimetype: file?.mimetype || null,
						})
					} catch (error) {
						this.logger.error(error)
						throw new InternalServerErrorException(error)
					}
				}

				let logo: any = {}
				if (saveFileDto?.appId && saveFileDto?.type == EFiles.Clients) {
					logo = await this.filesRepository.findOne({
						where: {
							client: {
								id: Number(saveFileDto?.appId),
							},
							tag: EFilesTags.Logo,
						},
					})
				}
				const spread = await this.getSpread(saveFileDto)
				if (spread) {
					const saved = await this.filesRepository.save([
						...result.map((r) => {
							const newFile = {
								fullPath: r.fullPath,
								mimetype: r.mimetype,
								tag: saveFileDto.tag,
								host: 'server',
								...spread,
							}
							if (saveFileDto?.tag == EFilesTags.Logo && !!logo) {
								return {
									...newFile,
									id: logo.id,
								}
							}
							return newFile
						}),
						...oldFiles,
					])
					return saved
				}

				throw new InternalServerErrorException('Can`t save file because entity id is not found')
			}
			throw new InternalServerErrorException('files not found')
		} catch (error) {
			// Если произошла ошибка кэтчим
			this.logger.error(error)
			throw new InternalServerErrorException(error)
		}
	}

	async getFilePath(id: number) {
		try {
			const fileFromDb = await this.filesRepository.findOne(id)
			if (fileFromDb.fullPath.indexOf('http') !== -1) {
				return fileFromDb.fullPath
			}
			return `${this.storageEndpoint}/${this.bucket}/${fileFromDb.fullPath}`
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException(error)
		}
	}

	async getFile(id: number) {
		try {
			const fileFromDb = await this.filesRepository.findOne(id)
			if (fileFromDb.fullPath.indexOf('http') !== -1) {
				const response = await this.httpService.axiosRef({
					url: fileFromDb.fullPath,
					method: 'GET',
					responseType: 'stream',
				})

				return response.data
			}

			const params = {
				Bucket: this.bucket,
				Key: fileFromDb.fullPath,
			}
			const response: GetObjectCommandOutput = await this.storage.send(new GetObjectCommand(params))

			return response.Body
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException(error)
		}
	}

	async deleteFileFromStorage(id: number) {
		try {
			const fileFromDb = await this.filesRepository.findOne(id)
			const bucketParams: PutObjectCommandInput = {
				Bucket: this.bucket,
				Key: fileFromDb.fullPath,
			}

			await this.storage.send(new DeleteObjectCommand(bucketParams))

			const deleted = await this.filesRepository.delete(id)

			return deleted.affected
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException(error)
		}
	}

	//client_app_photos
	async saveFileToFS(saveFileDto: SaveFileDto, userId, files) {
		try {
			const access = await this.accessEntity(saveFileDto, userId)

			if (!access) {
				throw new BadRequestException('Not found services, clients or address')
			}
			// Если все ок сохраняем
			const promises = []

			const oldFiles = files.files.filter((f) => f.id)

			files.files = files.files.filter((f) => !f.id)

			if (files) {
				for (const file of files.files) {
					try {
						// Сохраняем файл в папку upload
						let destination = file.originalname.split('.')
						destination = destination[destination.length - 1]
						destination =
							Date.now() +
							String(userId) +
							String(saveFileDto.appId) +
							file.originalname.replace(/([\s\W])/g, '').replace(destination, '') +
							'.' +
							destination
						const filePath = path.resolve(__dirname, '../../../../../uploads', destination)

						const promise = new Promise((resolve, reject) => {
							fs.writeFile(filePath, file.buffer, function (error) {
								if (error) {
									reject(error)
								}

								resolve({
									fullPath: `./uploads/${destination}`,
									mimetype: file?.mimetype || null,
								})
							})
						})

						promises.push(promise)
					} catch (error) {
						this.logger.error(error)
						throw new InternalServerErrorException(error)
					}
				}

				return Promise.all(promises)
					.then(async (result) => {
						let logo: any = {}
						if (saveFileDto?.appId && saveFileDto?.type == EFiles.Clients) {
							logo = await this.filesRepository.findOne({
								where: {
									client: {
										id: Number(saveFileDto?.appId),
									},
									tag: EFilesTags.Logo,
								},
							})
						}
						const spread = await this.getSpread(saveFileDto)
						if (spread) {
							const saved = await this.filesRepository.save([
								...result.map((r) => {
									const newFile = {
										fullPath: r.fullPath,
										mimetype: r.mimetype,
										tag: saveFileDto.tag,
										host: 'server',
										...spread,
									}
									if (saveFileDto?.tag == EFilesTags.Logo && !!logo) {
										return {
											...newFile,
											id: logo.id,
										}
									}
									return newFile
								}),
								...oldFiles,
							])
							return saved
						}
						throw new InternalServerErrorException('Can`t save file because entity id is not found')
					})
					.catch((error) => {
						this.logger.error(error)
						throw new InternalServerErrorException(error)
					})
			}
			throw new InternalServerErrorException('files not found')
		} catch (error) {
			// Если произошла ошибка кэтчим
			this.logger.error(error)
			throw new InternalServerErrorException(error)
		}
	}

	async getFilePathFromFS(id: number) {
		try {
			const fileFromDb = await this.filesRepository.findOne(id)
			return `${this.storageEndpoint}/${this.bucket}/${fileFromDb.fullPath}`
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException(error)
		}
	}

	async deleteFileFromFS(id: number) {
		// Находим файл в базе
		const file = await this.filesRepository.findOne(id)
		if (!file) throw new BadRequestException('File not found')

		const filePath = path.join(__dirname, '../../../../../', file.fullPath)
		fs.stat(filePath, function (error) {
			if (!error) {
				fs.unlinkSync(filePath)
			}
		})

		const deleted = await this.filesRepository.delete(id)

		return deleted.affected
	}

	async getOneFileByParams(getFileDto: GetFileDto) {
		try {
			const fileFromDb = await this.filesRepository.findOne({
				where: [{ fullPath: getFileDto.fullPath }, { id: getFileDto.fileId }],
			})
			return fileFromDb
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException(error)
		}
	}

	async getAll(dto: FileDto) {
		const query = []
		if (dto?.addressId) {
			query.push({
				addressesPhotos: {
					address: { id: dto?.addressId },
				},
			})
		}
		if (dto?.appId) {
			query.push({
				clientPhotos: {
					client: { id: dto?.appId },
				},
			})
		}
		if (dto?.serviceId) {
			query.push({
				servicesPhotos: { services: { id: dto?.serviceId } },
			})
		}

		if (!dto?.serviceId && !dto?.appId && !dto?.addressId)
			throw new InternalServerErrorException('One or more id is required')
		return this.filesRepository.find({
			where: query,
		})
	}

	async accessEntity(dto, userId) {
		const { appId, serviceId, addressId, userId: profileId } = dto
		if (!appId && !profileId) throw new InternalServerErrorException('appId is required')
		// Проверяем что пользователь есть в базе
		let access
		const user = await this.userService.findOneById(+userId)
		// Если нету отдаем ошибку 404
		if (!user) throw new BadRequestException('User not found')
		// Проверяем существование сущность и связь с пользователем
		if (profileId && dto?.type == EFiles.Profile) {
			access = await this.userService.findOneById(+profileId)
		} else if (appId && dto?.type == EFiles.Clients) {
			access = await this.clientsService.getOne({ appId: +appId })
		} else if (serviceId && appId && dto?.type == EFiles.Services) {
			access = await this.servicesService.findOne(+appId, +serviceId)
		} else if (addressId && appId && dto?.type == EFiles.Address) {
			access = await this.addressService.findOne(+addressId, +appId)
		} else {
			throw new InternalServerErrorException(
				'type and one of these fields are required: userId, appId, serviceId, addressId',
			)
		}

		return !!access
	}

	async getSpread(dto) {
		let spread = undefined
		if (dto.type === EFiles.Address && dto?.addressId) {
			spread = {
				address: {
					id: dto?.addressId,
				},
			}
		} else if (dto.type === EFiles.Clients && dto?.appId) {
			spread = {
				client: {
					id: dto?.appId,
				},
			}
		} else if (dto.type === EFiles.Services) {
			spread = {
				services: {
					id: dto?.serviceId,
				},
			}
		} else if (dto.type === EFiles.Profile) {
			spread = {
				user: {
					id: dto?.userId,
				},
			}
		}
		return spread
	}

	async saveToGoogleBucket() {
		try {
			const where = { host: EFilesHost.Server }
			const limit = 50

			const filesFromDb = await this.getFilesFromDBCron(limit, where)

			for (const file of filesFromDb) {
				const filePath = path.resolve(__dirname, '../../../../../uploads', file.fullPath)
				fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
					if (err) this.logger.error(err)
					return data
				})
			}
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	@Cron('* * 8 28 * *')
	async removeFilesFromServer() {
		try {
			const where = { host: EFilesHost.Server }
			const limit = 50

			let filesFromDb = await this.getFilesFromDBCron(limit, where)
			filesFromDb = filesFromDb.map((ffd) => ffd.fullPath)

			const filesFromDir = fs.readdirSync(path.resolve(__dirname, '../../../../../uploads'))

			const difference = _.difference(filesFromDir, filesFromDb)

			if (difference.length) {
				for (const file of difference) {
					fs.unlinkSync(path.resolve(__dirname, '../../../../../uploads', file))
					this.logger.warn(`${file} was deleted`)
				}
			}
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	async getFilesFromDBCron(limit, where) {
		const count = await this.filesRepository.count({
			where,
		})
		const filesFromDbPromise = []
		for (let index = 0; index <= count; index = index + limit) {
			const files = this.filesRepository.find({
				where,
				skip: index,
				take: limit,
			})
			filesFromDbPromise.push(files)
		}
		let result = await Promise.all(filesFromDbPromise)
		result = result.reduce((a, b) => a.concat(b))
		result = result.map((r) => ({
			fullPath: r.fullPath.split('./uploads/')[1],
			id: r.id,
		}))
		return result
	}
}
