export function getDateCell(value: Date) {
	return {
		v: value,
		t: 'd',
		z: 'dd-mm-yyyy',
	}
}

export function getNumberCell(value: number) {
	return {
		v: value,
		t: 'n',
	}
}

export function getHeaderCell(value: string) {
	return {
		v: value,
		t: 's',
		s: { font: { bold: true } },
	}
}
