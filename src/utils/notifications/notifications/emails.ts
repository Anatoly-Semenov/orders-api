export const forgotPasswordEmail = (callbackLink) => {
	return [
		{
			tag: 'h1',
			content: 'Forgot password',
			styles: [
				{
					key: 'color',
					value: 'orange',
				},
			],
			childs: [],
		},
		{
			tag: 'p',
			content: `Вы забыли пароль, вот ссылка на восстановление пароля -`,
			styles: [
				{
					key: 'color',
					value: 'black',
				},
			],
			childs: [
				{
					tag: 'a',
					content: callbackLink,
					href: callbackLink,
					styles: [
						{
							key: 'color',
							value: 'blue',
						},
					],
					childs: [],
				},
			],
		},
	]
}

export const createUserEmail = (data = null) => {
	return [
		{
			tag: 'h1',
			content: 'Ваш акканут создан!',
			styles: [
				{
					key: 'color',
					value: 'Blue',
				},
			],
			childs: [],
		},
		{
			tag: 'p',
			content: 'Ваш аккаунт успешно создан',
			styles: [
				{
					key: 'color',
					value: 'black',
				},
			],
			childs: [],
		},
		{
			tag: 'p',
			content: 'Пароль для авторизации - ' + data.password,
			styles: [
				{
					key: 'color',
					value: 'black',
				},
			],
			childs: [],
		},
		data.returnUrl
			? {
					tag: 'p',
					content: 'Пожалуйста подтвердите регистрацию перейдя по ссылке -',
					styles: [
						{
							key: 'color',
							value: 'black',
						},
					],
					childs: [
						{
							tag: 'a',
							content: data.returnUrl,
							href: data.returnUrl,
							styles: [
								{
									key: 'color',
									value: 'blue',
								},
							],
							childs: [],
						},
					],
			  }
			: undefined,
	]
}

export const accessCodeEmail = (data = null, returnUrl = '') => {
	return [
		{
			tag: 'h1',
			content: 'Ваш код подтверждения - ',
			styles: [
				{
					key: 'color',
					value: 'Blue',
				},
			],
			childs: [
				{
					tag: 'span',
					content: data.code,
					styles: [
						{
							key: 'color',
							value: 'green',
						},
					],
					childs: [],
				},
			],
		},
		{
			tag: 'a',
			content: returnUrl,
			href: returnUrl,
			styles: [
				{
					key: 'color',
					value: 'black',
				},
			],
			childs: [],
		},
	]
}

export const createClientEmail = (data = null) => {
	return [
		{
			tag: 'h1',
			content: 'Компания успешно создана',
			styles: [
				{
					key: 'color',
					value: 'Blue',
				},
			],
			childs: [],
		},
		{
			tag: 'p',
			content: 'Поздравляем теперь у вас есть компания!',
			styles: [
				{
					key: 'color',
					value: 'green',
				},
			],
			childs: [],
		},
	]
}
