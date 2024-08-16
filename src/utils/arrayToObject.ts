export const arrayToObject = (
	array: Array<string | number>,
	key = 'id',
	defaultValue?: string | number,
) => {
	const result =
		array?.map((i) => {
			return {
				[key]: i,
			}
		}) || (defaultValue ? [{ [key]: defaultValue }] : [])

	return result
}
