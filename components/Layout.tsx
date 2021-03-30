import Head from "next/head"
import { NextSeo } from "next-seo"
import Header from "./Header"

interface Props {
	title?: string
}

const Layout: React.FunctionComponent<Props> = ( { children, title } ) => {
	return (
		<div>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="/logo.png" rel="shortcut icon" />
				<link href="/logo.png" rel="icon" type="image/png" sizes="16x16" />
				<link href="/logo.png" rel="icon" type="image/png" sizes="32x32" />
				<link rel="apple-touch-icon" href="/logo.png" />
				<meta name="theme-color" content="#000000" />
			</Head>
			<NextSeo
				title={title}
				description='This is a Next-App 😊'
				canonical="http://localhost:3000"
			/>
			<Header/>
			<main>
				{children}
			</main>
		</div>
	)
}

Layout.defaultProps = {
	title: `Inicio 🚀`
}

export default Layout
