import { ConnectionOptions } from 'typeorm'
import { dbConfig } from './db.config'
import * as dotenv from 'dotenv'

dotenv.config()
const typeormConfig = dbConfig() as ConnectionOptions

export default typeormConfig
