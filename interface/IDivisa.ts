export interface IDivisa {
	base: string
	date: string
	rates: IRates[]
}

export interface IRates {
	name: string
	value: number
}