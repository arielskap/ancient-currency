import { useEffect, useRef, useState } from "react"
import { formatMoney } from "utils/formatMoney"
import { IRates } from "interface/IDivisa"
import { formatDate } from "utils/formatDate"
import { fetchDivisa } from "utils/divisa"
import colors from 'tailwindcss/colors'
import SvgReload from "./svg/Reload"

interface Props {
	tarifas: IRates[]
	nombre: string
	fecha: string
	cantPorPagina: number
}

const TableDivisa: React.FC<Props> = ( { tarifas, nombre, fecha, cantPorPagina } ) => {
	const tbodyRef = useRef<HTMLTableSectionElement>( null )
	const [position, setPosition] = useState( 1 )
	const [tarifaState, setTarifaState] = useState( {
		value: tarifas,
		date: fecha
	} )
	const paginations = Math.ceil( tarifas.length / cantPorPagina )

	const handleClickChangePagination = ( pagina: number ) => {
		setPosition( pagina )
	}

	useEffect( () => {
		setInterval( async () => {
			const divisa = await fetchDivisa( nombre )

			setTarifaState( { value: divisa.rates, date: divisa.date } )
		}, 15000 )
	}, [] )

	const handleClickReCharge = async () => {
		const divisa = await fetchDivisa( nombre )
		const tbody = tbodyRef.current

		if ( tbody ) {
			tbody.style.color = colors.green[600]
			setTimeout( () => {
				tbody.style.color = colors.black
			}, 2000 )
		}
		setTarifaState( { value: divisa.rates, date: divisa.date } )
	}

	return (
		<div className='w-full max-w-xs mx-auto'>
			<div className='bg-white'>
				<div className='relative py-1 text-center border border-blue-900'>
					<h2>Moneda: <span className='font-medium'>{nombre}</span></h2>
				</div>
				<p className='text-center border border-blue-900'>Fecha: {formatDate( tarifaState.date )}</p>
				<div>
					<table className='w-full mx-auto table-fixed'>
						<thead>
							<tr>
								<th className='w-1/2 border border-blue-900'>Divisa</th>
								<th className='w-1/2 border border-blue-900'>Valor</th>
							</tr>
						</thead>
						<tbody className="transition-colors duration-300" ref={tbodyRef}>
							{tarifaState.value.map( ( { name, value }, i ) => {
								if ( i < ( cantPorPagina * position ) && i >= ( ( cantPorPagina * position ) - cantPorPagina ) ) {
									return (
										<tr className='hover:bg-blue-100' key={`tr-${name}`}>
											<td className='px-2 py-1 border border-blue-500'>{name}</td>
											<td className='px-2 py-1 text-right border border-blue-500'>{formatMoney( value, 6 )}</td>
										</tr>
									)
								} else {
									return null
								}
							} )}
						</tbody>
					</table>
				</div>
			</div>
			<div className="flex items-center justify-between pt-2">
				<div className='overflow-x-auto'>
					{Array.from( { length: paginations } ).map( ( _, i ) => {
						return (
							<button onClick={() => handleClickChangePagination( i + 1 )} type='button' key={`button-pagination-${i}`} className={`${i === 0 ? `rounded-l-full` : i === ( paginations - 1 ) && `rounded-r-full` } border border-gray-200 px-3 py-1 font-bold text-white bg-blue-800 hover:bg-gray-400`}>
								{i + 1}
							</button>
						)
					} )}
				</div>
				<button className='px-2 py-2 bg-white border border-blue-400 rounded hover:bg-blue-200' type='button' onClick={handleClickReCharge}>
					<SvgReload className="object-contain w-5" />
				</button>
			</div>
		</div>
	)
}

export default TableDivisa
