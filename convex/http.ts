import { httpRouter } from 'convex/server'
import { DB_TRUSTED_ORIGINS } from '@/lib/constants.db'
import { httpAction } from './_generated/server'
import { authComponent, createAuth } from './auth'
import { resend } from './resend'

const http = httpRouter()

authComponent.registerRoutes(http, createAuth, {
	cors: {
		allowedOrigins: DB_TRUSTED_ORIGINS,
		allowedHeaders: ['Content-Type', 'Authorization'],
		exposedHeaders: ['Set-Cookie'],
	},
})

http.route({
	path: '/resend-webhook',
	method: 'POST',
	handler: httpAction(async (ctx, req) => {
		return await resend.handleResendEventWebhook(ctx, req)
	}),
})

export default http
