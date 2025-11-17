import {
	type AuthFunctions,
	createClient,
	type GenericCtx,
} from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { requireActionCtx } from '@convex-dev/better-auth/utils'
import { betterAuth } from 'better-auth'
import { anonymous, magicLink } from 'better-auth/plugins'
import { DB_TRUSTED_ORIGINS } from '@/lib/constants.db'
import { components, internal } from './_generated/api'
import type { DataModel } from './_generated/dataModel'
import { resend } from './resend'

const PROVIDERS_CONFIG = {
	google: {
		clientId: process.env.AUTH_GOOGLE_ID as string,
		clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
	},
} as const

const authFunctions: AuthFunctions = internal.auth

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth, {
	authFunctions,
	triggers: {
		user: {
			onCreate: async (ctx, doc) => {
				await ctx.db.insert('userProfiles', {
					userId: doc._id,
					name: doc.name,
				})
			},
			onDelete: async (ctx, doc) => {
				const userProfile = await ctx.db
					.query('userProfiles')
					.withIndex('by_userId', (q) => q.eq('userId', doc._id))
					.unique()
				if (userProfile) {
					await ctx.db.delete(userProfile._id)
				}

				const cycles = await ctx.db
					.query('cycles')
					.withIndex('by_userId', (q) => q.eq('userId', doc._id))
					.collect()

				await Promise.all(cycles.map((cycle) => ctx.db.delete(cycle._id)))

				const sessions = await ctx.db
					.query('sessions')
					.withIndex('by_userId', (q) => q.eq('userId', doc._id))
					.collect()

				await Promise.all(sessions.map((session) => ctx.db.delete(session._id)))

				const roomsAccess = await ctx.db
					.query('roomsAccess')
					.withIndex('by_userId', (q) => q.eq('userId', doc._id))
					.collect()

				await Promise.all(
					roomsAccess.map((access) => ctx.db.delete(access._id)),
				)
			},
		},
	},
})

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false },
) => {
	return betterAuth({
		// disable logging when createAuth is called just to generate options.
		// this is not required, but there's a lot of noise in logs without it.
		logger: {
			disabled: optionsOnly,
		},
		trustedOrigins: DB_TRUSTED_ORIGINS,
		database: authComponent.adapter(ctx),
		baseURL: DB_TRUSTED_ORIGINS[0],
		account: {
			accountLinking: {
				enabled: true,
				trustedProviders: ['google'],
			},
		},
		emailAndPassword: {
			enabled: false,
		},
		socialProviders: {
			google: {
				...PROVIDERS_CONFIG.google,
				accessType: 'offline',
			},
		},
		plugins: [
			anonymous({ disableDeleteAnonymousUser: true }),
			magicLink({
				sendMagicLink: async (data) => {
					console.log('SEND MAGIC LINK', data)
					// This function only requires a `runMutation` property on the ctx object,
					// but we'll make sure we have an action ctx because we know a network
					// request is being made, which requires an action ctx.
					await resend.sendEmail(requireActionCtx(ctx), {
						to: data.email,
						from: 'hello@fokua.app',
						subject: 'Verify your email',
						html: `<p>Click <a href="${data.url}">here</a> to verify your email</p>`,
					})
				},
			}),
			convex(),
		],
	})
}

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi()
