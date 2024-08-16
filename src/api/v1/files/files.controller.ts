import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UploadedFiles,
	UseInterceptors,
	Query,
	Req,
	Res,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Readable } from 'stream'
import { SdkStream } from '@aws-sdk/types'

import { ThrowError } from 'src/decorators/ThrowError.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from '../users/decorators/users.decorator'
import { Role } from '../users/enums/user-roles.enum'
import { FileDto } from './dto/file.dto'
import { GetFileDto } from './dto/get-file.dto'
import { SaveFileDto } from './dto/save-file.dto'
import { FilesService } from './files.service'

@ApiTags('Файлы')
@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@ApiOperation({
		operationId: 'add-file',
		summary: 'Загрузка файла',
		description: 'Вернет информацию о созданных объектах',
	})
	@ApiResponse({
		status: 201,
		description: 'Вренет массив созданных файлов в виде объекта',
		type: SaveFileDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если нет прав доступа',
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если связанная сущность не была найдена',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				appId: { type: 'number' },
				serviceId: { type: 'number' },
				addressId: { type: 'number' },
				userId: { type: 'number' },
				type: {
					type: 'string',
					enum: ['clients', 'services', 'address', 'profile'],
					default: 'clients',
				},
				files: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Post('/add')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
			limits: {
				fieldSize: 50,
			},
		}),
	)
	@ThrowError('files', 'saveFile')
	saveFile(
		@Body() saveFileDto: SaveFileDto,
		@User() user,
		@Req() req,
		@UploadedFiles() files: Express.Multer.File[],
	) {
		return this.filesService.saveFileToStorage(saveFileDto, user.id, files)
	}

	@ApiOperation({
		operationId: 'get-one-files',
		summary: 'Получить один файл',
		description: 'Вернет объект файла в зависимости от переданных параметров',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет объект файла в зависимости от переданных параметров',
	})
	@ApiQuery({
		type: GetFileDto,
		required: true,
	})
	@Get('/get-one')
	@ThrowError('files', 'getFile')
	getOneFile(@Query() getFileDto: GetFileDto) {
		return this.filesService.getOneFileByParams(getFileDto)
	}

	@ApiOperation({
		operationId: 'get-file-path',
		summary: 'Получить файл',
		description: 'получить файл',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет файл',
	})
	@ApiParam({
		name: 'id',
		description: 'id файла',
	})
	@Get('/file-path/:id')
	getFilePath(@Param('id') id: string) {
		return this.filesService.getFilePath(+id)
	}

	@ApiOperation({
		operationId: 'get-file-path',
		summary: 'Получить файл',
		description: 'получить файл',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет файл',
	})
	@ApiParam({
		name: 'id',
		description: 'id файла',
	})
	@Get('/file/:id')
	async getFile(@Param('id') id: string, @Res() res) {
		const data: SdkStream<Readable | any | Blob> = await this.filesService.getFile(+id)
		res.set({
			'Content-Type': 'image/jpeg',
			'Content-Disposition': 'inline',
		})
		;(data as Readable).pipe(res)
	}

	@ApiBearerAuth()
	@ApiOperation({
		operationId: 'delete-file',
		summary: 'Удаление файла',
		description: 'Вернет 1 в случае успеха, в противном случае 0',
	})
	@ApiResponse({
		status: 200,
		description: 'Вренет 1 - если удаление прошло успешно, 0 - если не удалось удалить',
	})
	@ApiResponse({
		status: 401,
		description: 'Вернет 401 если пользователь не авторизован',
	})
	@ApiResponse({
		status: 403,
		description: 'Вернет 403 если нет прав доступа',
	})
	@ApiResponse({
		status: 404,
		description: 'Вернет 404 если файл не был найден',
	})
	@ApiParam({
		name: 'id',
		description: 'id файла',
		type: String,
	})
	@Auth([
		Role.CLIENTADMIN,
		Role.CLIENTMANAGER,
		Role.OWNERADMIN,
		Role.OWNERMANAGER,
		Role.OWNERSUPPORT,
	])
	@Delete('/delete/:id')
	@ThrowError('files', 'deleteFile')
	deleteFileFromStorage(@Param('id') id: string, @Req() req) {
		return this.filesService.deleteFileFromStorage(+id)
	}

	@ApiOperation({
		operationId: 'get-all-files',
		summary: 'Получить все файлы',
		description: 'Вернет объект файла в зависимости от переданных параметров',
	})
	@ApiResponse({
		status: 200,
		description: 'Вернет массив объектов файлов в зависимости от переданных параметров',
	})
	@ApiResponse({
		status: 500,
		description: 'Вернет 500 если не было передано ни одно id сущности',
	})
	@ApiQuery({
		type: FileDto,
		required: true,
	})
	@Get()
	@ThrowError('files', 'getAll')
	getAll(@Query() dto: FileDto) {
		return this.filesService.getAll(dto)
	}

	@Get('/test')
	removeFilesFromServer() {
		return this.filesService.saveToGoogleBucket()
	}
}
