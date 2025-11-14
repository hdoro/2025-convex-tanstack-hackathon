import { httpRouter } from 'convex/server'
import { DB_TRUSTED_ORIGINS } from '@/lib/constants.db'
import { createAuth } from './auth'
import { authComponent } from './auth/client'

const http = httpRouter()

authComponent.registerRoutes(http, createAuth, {
	cors: {
		allowedOrigins: DB_TRUSTED_ORIGINS,
		allowedHeaders: ['Content-Type', 'Authorization'],
		exposedHeaders: ['Set-Cookie'],
	},
})

export default http
