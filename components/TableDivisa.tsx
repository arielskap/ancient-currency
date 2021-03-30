import { useState } from "react"
import { formatMoney } from "utils/formatMonet"
import { IRates } from "interface/IDivisa"
import { formatDate } from "utils/formatDate"

interface Props {
	tarifas: IRates[]
	nombre: string
	fecha: string
	cantPorPagina: number
}

const TableDivisa: React.FC<Props> = ( { tarifas, nombre, fecha, cantPorPagina } ) => {
	const [position, setPosition] = useState( 1 )
	const paginations = Math.ceil( tarifas.length / cantPorPagina )

	const handleClickChangePagination = ( pagina: number ) => {
		setPosition( pagina )
	}

	return (
		<div className='px-6 mx-2 border border-blue-800'>
			<h2 className='text-center'>Moneda: {nombre}</h2>
			<div className='flex justify-center border border-blue-600 rounded'>
				<table className='table-auto'>
					<thead>
						<tr>
							<th>Divisa</th>
							<th>Valor</th>
						</tr>
					</thead>
					<tbody>
						{tarifas.map( ( { name, value }, i ) => {
							if ( i < ( cantPorPagina * position ) && i >= ( ( cantPorPagina * position ) - cantPorPagina ) ) {
								return (
									<tr className='hover:bg-blue-100' key={`tr-${name}`}>
										<td className='px-2 py-1 border border-gray-400'>{name}</td>
										<td className='px-2 py-1 text-right border border-gray-400'>{formatMoney( value, 6 )}</td>
									</tr>
								)
							} else {
								return null
							}
						} )}
					</tbody>
				</table>
			</div>
			<div className="grid grid-cols-7 pt-2 gap-x-2">
				{Array.from( { length: paginations } ).map( ( _, i ) => {
					return (
						<button onClick={() => handleClickChangePagination( i + 1 )} type='button' key={`button-pagination-${i}`} className="px-2 py-1 font-bold text-white bg-blue-800 rounded-l hover:bg-gray-400">
							{i + 1}
						</button>
					)
				} )}
			</div>
			<div className='text-center'>Fecha: {formatDate( fecha )}</div>
		</div>
	)
}

export default TableDivisa
