import { Social } from './enums/social.enums'

export const jwtConstants = {
	secret: process.env.JWT_SECRET_KEY,
}

export const socialToAvatarPath = {
	[Social.Yandex]: `https://avatars.yandex.net/get-yapic/:avatarId/islands-retina-50`,
}
