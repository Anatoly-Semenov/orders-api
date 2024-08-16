export const recurrentIdClear = async (data, exclude = []) => {
	for (const i in data) {
		if (i == 'id') {
			delete data[i]
		}

		if (typeof data[i] === 'object' && !exclude.includes(i)) {
			if (data[i]?.length) {
				for (const item of data[i]) {
					await recurrentIdClear(item, exclude)
				}
			}
			await recurrentIdClear(data[i], exclude)
		}
	}

	return data
}
