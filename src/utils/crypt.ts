// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'QBPSECRET')

export async function cryptrEncode(data) {
	return cryptr.encrypt(data)
}
export async function cryptrDecode(data) {
	return cryptr.decrypt(data)
}
