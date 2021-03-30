interface Props {
	action?: any
	children: React.ReactNode
	type: 'button' | 'submit'
}

export const Button: React.FC<Props> = ( { action, children, type = `button` } ) => {
	return (
		<button className='px-2 py-1 border-2 border-blue-700 rounded' type={type} onClick={action}>{children}</button>
	)
}
