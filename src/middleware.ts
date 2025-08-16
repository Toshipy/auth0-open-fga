import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth0 } from './lib/auth0'

const isPublicPage = (pathname: string) => {
	return (
		/^\/(api\/swagger|api-docs)(\/.*)?$/.test(pathname) ||
		/^\/$/.test(pathname) ||
		/\.(jpg|jpeg|png|gif|ico|svg)$/.test(pathname)
	)
}

export async function middleware(request: NextRequest) {
	// 環境変数の有無をブール値でログ（値自体は出力しない）
	console.log('Auth0 env present', {
		domain: !!(process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL),
		appBaseUrl: !!(process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL),
		secret: !!process.env.AUTH0_SECRET,
		clientId: !!process.env.AUTH0_CLIENT_ID,
		clientSecret: !!process.env.AUTH0_CLIENT_SECRET,
	})

	const authRes = await auth0.middleware(request)

	const { pathname } = request.nextUrl
	if (isPublicPage(pathname)) {
		return NextResponse.next()
	}

	if (request.nextUrl.pathname.startsWith('/auth')) {
		return authRes
	}

	const session = await auth0.getSession(request)
	if (!session) {
		return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin))
	}

	try {
		await auth0.getAccessToken(request, authRes)
	} catch {
		return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin))
	}

	return authRes
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
	]
}


