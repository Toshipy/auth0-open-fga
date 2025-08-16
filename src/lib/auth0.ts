import { Auth0Client } from '@auth0/nextjs-auth0/server'

export const auth0 = new Auth0Client({
	domain: process.env.AUTH0_DOMAIN,
	appBaseUrl: process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL,
	secret: process.env.AUTH0_SECRET,
	clientId: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	authorizationParameters: {
		audience: process.env.AUTH0_AUDIENCE ?? '',
		scope: 'openid profile email'
	},
	session: {
		rolling: true,
		absoluteDuration: 60 * 60 * 24 * 3,
		inactivityDuration: 60 * 60 * 24 * 1
	}
})


