export enum ETinkoffTaxation {
	OSN = 'osn',
	USN_INCOME = 'usn_income',
	USN_INCOME_OUTCOME = 'usn_income_outcome',
	PATENT = 'patent',
	ENVD = 'envd',
	ESN = 'esn',
}

export enum ETinkoffPaymentMethod {
	FULL_PAYMENT = 'full_payment',
	FULL_PREPAYMENT = 'full_prepayment',
	PREPAYMENT = 'prepayment',
	ADVANCE = 'advance',
	PARTIAL_PAYEMNT = 'partial_payment',
}
export enum ETinkoffPaymentObject {
	COMMODITY = 'commodity',
	EXCISE = 'excise',
	JOB = 'job',
	SERVICE = 'service',
	PAYMENT = 'payment',
	AGGENT_COMMISION = 'agent_commission',
	COMPOSITE = 'composite',
	ANOTHER = 'another',
}
export enum ETinkoffTax {
	NONE = 'none',
	VAT_0 = 'vat0',
	VAT_10 = 'vat10',
	VAT_20 = 'vat20',
	VAT_110 = 'vat110',
	VAT_120 = 'vat120',
}

export enum ETinkoffAddresses {
	LEGAL = 'legal',
	ACTUAL = 'actual',
	POST = 'post',
	OTHER = 'other',
}
