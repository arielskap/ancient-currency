export interface IDivisa {
	base: string
	date: string
	rates: IRates[]
	error?: string
}

export interface IRates {
	name: string
	value: number
}